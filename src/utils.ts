import { Context, Token } from "./types";
import { User } from './generated/prisma-client';
import { promisify } from 'util';
import { verify } from 'jsonwebtoken'

export const APP_SECRET = 'secret';

export async function getUserId(ctx: Context): Promise<string | null> {
  const Authorization = ctx.request.get('Authorization');

  if (!Authorization)
    return null;

  const token = Authorization.replace('Bearer ', '');
  const promisifiedVerify = promisify(verify);
  const decoded = await promisifiedVerify(token, APP_SECRET).catch(() => {});
  return decoded && (decoded as Token).userId;
}

export async function getUser(ctx: Context): Promise<User> {
  const userId = await getUserId(ctx);
  return userId && await ctx.prisma.user({ id: userId });
}
