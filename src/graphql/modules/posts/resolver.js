import Post from "../../../models/Post";
import User from "../../../models/User";

import { POST_ADDED, POST_UPDATED, POST_DELETED } from "./channels";

export default {
  Post: {
    author: async (post) => {
      const user = await User.findById(post.author);

      return user;
    },
  },
  Query: {
    posts: async () => {
      const posts = await Post.find();

      return posts;
    },
    post: async (root, { id }) => {
      const post = await Post.findById(id);

      return post;
    },
  },
  Mutation: {
    createPost: async (root, { data }, { pubsub }) => {
      const post = await Post.create(data);

      pubsub.publish(POST_ADDED, {
        postAdded: post,
      });

      return post;
    },
    updatePost: async (root, { id, data }, { pubsub }) => {
      const post = await Post.findByIdAndUpdate(id, data, { new: true });

      pubsub.publish(POST_UPDATED, {
        postUpdated: post,
      });

      return post;
    },
    deletePost: async (root, { id }, { pubsub }) => {
      const post = await Post.findByIdAndDelete(id);

      pubsub.publish(POST_DELETED, {
        postDeleted: post,
      });

      return post;
    },
  },
  Subscription: {
    postAdded: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(POST_ADDED),
    },
    postUpdated: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(POST_UPDATED),
    },
    postDeleted: {
      subscribe: (root, args, { pubsub }) => pubsub.asyncIterator(POST_DELETED),
    },
  },
};
