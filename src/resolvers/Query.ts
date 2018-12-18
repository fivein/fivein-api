import { QueryResolvers } from '../generated/graphqlgen'
import { getUserId } from '../utils'

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,

  me: (parent, args, context) => {
    const userId = getUserId(context);
    console.log(userId);
    return context.prisma.user({ id: userId })
  },
};
