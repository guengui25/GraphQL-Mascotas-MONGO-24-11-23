import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

import { typeDefs } from "./GraphQL/pet.ts";

import { Mutation } from "./resolvers/mutations.ts";
import { Query } from "./resolvers/query.ts";


import { Pet } from "./types.ts";


// Los resolvers son las funciones que se ejecutan cuando se hace una petición -> Se definen en resolvers/query.ts y resolvers/mutations.ts

const resolvers = { Mutation, Query};

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers,
});

const { url } = await startStandaloneServer(server, {listen: { port: 3000 }}); // Se pone el puerto 3000

console.log(`🛸 Server ready at ${url}`);
