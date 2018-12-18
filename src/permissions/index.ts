import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, context) => {
    const userId = await getUserId(context);
    return userId != null;
  }),
};

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    renew: rules.isAuthenticatedUser,
  },
});
