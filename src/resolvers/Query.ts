import { QueryResolvers } from '../generated/graphqlgen'
import { getUser } from '../utils'

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,

  me: async (parent, args, ctx) => {
    return await getUser(ctx);
  },
};
