import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Pet } from "./types.ts";

// Data --> En el ejemplo no se usa base de datos --> Se usa un array de mascotas

let pets: Pet[] = [
  { id: "1", name: "Pippin 👽", breed: "Setter" },
  { id: "2", name: "Arwen", breed: "Labrador" },
  { id: "3", name: "Frodo", breed: "Pointer" },
  { id: "4", name: "Sam", breed: "Spaniel" },
  { id: "5", name: "Merry", breed: "Poodle" },
];

// The GraphQL schema -> El esquema de grapgh ql es un string ; para que salgan colores -> #graphql

// Se define TODO lo que ofrece la  API

const typeDefs = `#graphql
  
  # Cuando el tipo es obligatorio se pone -> ! ; Cuando es optativo no se pone nada

  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  
  # Query -> son las funciones para las peticiones de datos

  type Query {
    hello: String!

    # pets : [Pet!]!         # Pide todas las mascotas -> Devuelve un array [Pet] (Pet de graphql)
                              # Primera exclamación, siempre devuelve un Pet 
                              # Segunda exclamación siempre devuelve un array

    pets (breed:String) : [Pet!]!         # Agrego un argumento a la query pets -> Devuelve todas las mascotas de una raza determinada 
                                            # si está el argumento, si no, devuelve todas las mascotas

    pet(id: ID!): Pet!    # Pide una mascota por id
                              # Recibe un id de tipo ID! y SIEMPRE va a devolver un ID -> Por la exclamación

    # No tiene sentido, es mejor hacer una query que devuelva todas las mascotas y luego filtrar por raza

    # petByBreed(breed:String!):[Pet!]!   # Devuelve todas las mascotas de una raza determinada
  }
  
  # Mutation -> son las funciones para las peticiones de modificación de datos

  type Mutation {
    addPet(id: ID!, name: String!, breed: String!): Pet! # Añade una mascota -> Devuelve un Pet

    deletePet(id: ID!): Pet! # Borra una mascota -> Devuelve un Pet 

    updatePet(id: ID!, name: String!, breed: String!): Pet! # Actualiza una mascota -> Devuelve un Pet
  }
`;


// A map of functions which return data for the schema.

// Los resolvers son las funciones que se ejecutan cuando se hace una petición

// Se define TODO lo que ofrece la API

// Son las Querys y las Mutations

// Las Querys son las funciones que se ejecutan cuando se hace una petición de datos

// Las Mutations son las funciones que se ejecutan cuando se hace una petición de modificación de datos

const resolvers = {
  /*
  Query es un objeto de typeScript -> Se define como un objeto de JS
  Se definen las funciones que se ejecutan cuando se hace una petición de datos

  Las querys tienen tres parámetros:
    parent: unknown -> Ya veremos qué es
    args: unknown -> Son los argumentos que recibe la query
    context: unknown -> No se usa
  */

  Query: {
    hello: () => "world",

        /*
    pets: (_parent: unknown, args: unknown):Pet[] => { // Devuelve todas las mascotas -> Devuelve un array [Pet] (Pet de graphql)
      return pets; 
    },
    */

    pets: (_parent: unknown, args: {breed?: string}):Pet[] => { // Devuelve todas las mascotas -> Puede recibir una raza y devolver el array de mascotas solo de esa raza
      
      if(args.breed){
        return pets.filter(pet => pet.breed === args.breed); // Si hay argumento, devuelve todas las mascotas de esa raza
      }

      return pets; // Devuelve todas las mascotas -> Devuelve un array [Pet] (Pet de graphql)
    },

    pet: (_parent: unknown, args: { id: string }) => {  // Devuelve una mascota por id -> Recibe un id de tipo ID! y SIEMPRE va a devolver un ID
      
      /* Forma alternativa de hacerlo
      const {id} = args; // Se puede hacer destructuring de los argumentos

      const pet = pets.find(pet => pet.id === id); // Busca la mascota por id
      */

      const pet = pets.find((pet) => pet.id === args.id); // Busca la mascota por id

      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, { // Si no encuentra la mascota lanza un error, ya que SOLO puede devolver un Pet (por la exclamación del esquema)
          extensions: { code: "NOT_FOUND" },
        });
      }
      return pet;
    },
    /*
    petByBreed: (_parent: unknown, args: { breed: string }):Pet[] => { // Devuelve todas las mascotas de una raza determinada
      const petsByBreed = pets.filter((pet) => pet.breed === args.breed); // No se lanza error porque puede devolver un array vacío
      return petsByBreed; 
    }
    */
  },

  /*
  Mutation es un objeto de typeScript -> Se define como un objeto de JS
  Se definen las funciones que se ejecutan cuando se hace una petición de modificación de datos

  Las mutations tienen tres parámetros:
    parent: unknown -> Ya veremos qué es
    args: unknown -> Son los argumentos que recibe la mutation
    context: unknown -> No se usa
  */

  Mutation: {

    addPet: (_: unknown, args: { id: string; name: string; breed: string }) => {
      
      // Si hubiera base de datos se haría una consulta para ver si existe una mascota con ese id -> Salvo que el id se autogenere
      if(pets.find(pet => pet.id === args.id)){
        throw new GraphQLError(`Pet with id ${args.id} already exists`); // Si ya existe una mascota con ese id lanza un error
      }

      // Se crea una mascota con los argumentos que recibe la mutation
      const pet = {
        id: args.id,
        name: args.name,
        breed: args.breed,
      };

      pets.push(pet); // Se añade la mascota al array de mascotas -> Si hubiera base de datos se haría un insert

      return pet; // Se devuelve la mascota -> Si hubiera base de datos se devolvería el id de la mascota


    },

    deletePet: (_: unknown, args: { id: string }) => {
      const pet = pets.find((pet) => pet.id === args.id);
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      pets = pets.filter((pet) => pet.id !== args.id); // Filtra el array de mascotas y devuelve todas las mascotas menos la que se quiere borrar
      
      return pet;
    },

    updatePet: (
      _: unknown,
      args: { id: string; name: string; breed: string }
    ) => {
      const pet = pets.find((pet) => pet.id === args.id); // Busca la mascota por id

      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      // Actualiza la mascota
      pet.name = args.name;
      pet.breed = args.breed;

      return pet;
    },
  },

};

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers,
});

const { url } = await startStandaloneServer(server, {listen: { port: 3000 }}); // Se pone el puerto 3000

console.log(`🛸 Server ready at ${url}`);
