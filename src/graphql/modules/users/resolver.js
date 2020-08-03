import User from "../../../models/User";

import { USER_ADDED, USER_UPDATED, USER_DELETED } from "./channels";

export default {
  User: {
    fullName: (user) => {
      return `${user.firstName} ${user.lastName}`;
    },
  },
  Query: {
    users: async () => {
      const users = await User.find();

      return users;
    },
    user: async (root, { id }) => {
      const user = await User.findById(id);

      return user;
    },
  },
  Mutation: {
    createUser: async (root, { data }, { pubsub }) => {
      const user = await User.create(data);

      pubsub.publish(USER_ADDED, {
        userAdded: user,
      });

      return user;
    },
    updateUser: async (root, { id, data }, { pubsub }) => {
      const user = await User.findByIdAndUpdate(id, data, { new: true });

      pubsub.publish(USER_UPDATED, {
        userUpdated: user,
      });

      return user;
    },
    deleteUser: async (parent, { id }, { pubsub }) => {
      const user = await User.findByIdAndDelete(id);

      pubsub.publish(USER_DELETED, {
        userDeleted: user,
      });

      return user;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(USER_ADDED),
    },
    userUpdated: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(USER_UPDATED),
    },
    userDeleted: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(USER_DELETED),
    },
  },
};
