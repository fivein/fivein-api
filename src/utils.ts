import { verify } from 'jsonwebtoken'
import { Prisma, User } from "./generated/prisma-client";

export const APP_SECRET = 'secret';

interface Token {
  userId: string
}

interface Context {
  prisma: Prisma;
  request: any
}

export function getUserId(ctx: Context): string | null {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    try {
      const verifiedToken = verify(token, APP_SECRET) as Token;
      return verifiedToken.userId;
    } catch (err) {
    }
    return null;
  }
}

export async function getUser(ctx: Context): User {
  const userId = getUserId(ctx);
  if (userId == null) {
    return null;
  }
  return await ctx.prisma.user({ id: userId });
}
