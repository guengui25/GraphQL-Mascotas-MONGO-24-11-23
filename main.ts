import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

import mongoose from "mongoose";

import { typeDefs } from "./GraphQL/typeDefs.ts";

import { Mutation } from "./resolvers/mutations.ts";
import { Query } from "./resolvers/query.ts";

try{  // Conexión a la base de datos
  
  const MONGO_URL = Deno.env.get("MONGO_URL");
  
  if(!MONGO_URL) {
      console.error("MONGO_URL must be provided");
      Deno.exit(1);
  }
  
  await mongoose.connect(MONGO_URL);
  
  // Los resolvers son las funciones que se ejecutan cuando se hace una petición -> Se definen en resolvers/query.ts y resolvers/mutations.ts
  
  const resolvers = { Mutation, Query};
  
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
  });
  
  const { url } = await startStandaloneServer(server, {listen: { port: 3000 }}); // Se pone el puerto 3000
  
  console.log(`🛸 Server ready at ${url}`);
}
catch(error){
  console.error(error);
  Deno.exit(1);
}

