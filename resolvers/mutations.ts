import { Pet } from "../types.ts"; // Importo el tipo de typescript

import { GraphQLError } from "https://cdn.skypack.dev/graphql?dts"; // Importo los errores de graphql

/*
    Las Mutations son las funciones que se ejecutan cuando se hace una petición de modificación de datos
    
    Mutation es un objeto de typeScript -> Se define como un objeto de JS
    Se definen las funciones que se ejecutan cuando se hace una petición de modificación de datos

    Las mutations tienen tres parámetros:
        parent: unknown -> Ya veremos qué es
        args: unknown -> Son los argumentos que recibe la mutation
        context: unknown -> No se usa
  */

export const Mutation = {

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