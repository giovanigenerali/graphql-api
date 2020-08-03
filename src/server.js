require("dotenv").config();
import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";

function server({ typeDefs, resolvers }) {
  mongoose.connect(`${process.env.MONGODB_URL}/graphql`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const pubsub = new PubSub();

  const apollo = new ApolloServer({ typeDefs, resolvers, context: { pubsub } });

  apollo
    .listen()
    .then(({ url }) => console.log(`⚡️ Server started at ${url}`));
}

export default server;
