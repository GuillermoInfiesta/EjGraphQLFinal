import {ApolloServer} from "npm:@apollo/server@4.9.5"
import {startStandaloneServer} from "npm:@apollo/server@4.9.5/standalone"
import { gqlSchema, Query, Mutation } from "./graphQL/graphPet.ts"
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import mongoose from "npm:mongoose@7.6.3"
import express from "npm:express@4.18.2"


const env = await load();

try{
  await mongoose.connect(env.MONGO_URL || Deno.env.get("MONGO_URL") || "");
}catch(e){
  console.log(e.message);
}
console.log("Conexion establecida")

const miapp = express();

miapp.use(express.json());


const server = new ApolloServer({
  typeDefs: gqlSchema,
  resolvers: {
    Query,
    Mutation
  }
});

const {url} = await startStandaloneServer(server, {
  listen: {
    port: 3003
  }
})
console.info(`Server is listening if you ask at ${url}`);













