import { MutationResolvers } from '../generated/graphqlgen'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { APP_SECRET } from '../utils'
import { User } from "../generated/prisma-client";

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  signup: async (parent, { username, email, password }, context) => {
    const hashedPassword = await hash(password, 10);
    const user = await context.prisma.createUser({
      username,
      email,
      password: hashedPassword,
    });
    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user,
    }
  },
  login: async (parent, { usernameOrEmail, password }, ctx) => {
    const userFromEmail: User = await ctx.prisma.user({ email: usernameOrEmail });
    const userFromUsername: User = await ctx.prisma.user({ username: usernameOrEmail });

    const user: User = !!userFromEmail ? userFromEmail : userFromUsername;
    if (!user) {
      throw new Error(`No user found for username or email: ${usernameOrEmail}`);
    }

    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user,
    }
  },
  renew: (parent, args, ctx) => {
    throw new Error("Resolver not implemented");
  }
};
