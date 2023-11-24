import { Pet } from "../types.ts"; // Importo el tipo de typescript

import { GraphQLError } from "https://cdn.skypack.dev/graphql?dts"; // Importo los errores de graphql

import PetModel from "../DB/pet.ts"; // Importo el modelo de la base de datos

/*
    Las Querys son las funciones que se ejecutan cuando se hace una petición de datos

    Query es un objeto de typeScript -> Se define como un objeto de JS
    Se definen las funciones que se ejecutan cuando se hace una petición de datos

    Las querys tienen tres parámetros:
        parent: unknown -> Ya veremos qué es
        args: unknown -> Son los argumentos que recibe la query
        context: unknown -> No se usa
  */

export const Query = {

        /*
    pets: (_parent: unknown, args: unknown):Pet[] => { // Devuelve todas las mascotas -> Devuelve un array [Pet] (Pet de graphql)
        return pets; 
    },
    */

    pets: async (_parent: unknown, args: {breed?: string}): Promise<Pet[]> => { // Devuelve todas las mascotas -> Puede recibir una raza y devolver el array de mascotas solo de esa raza
        
        if(args.breed){
            const pets = await PetModel.find({breed: args.breed}).exec(); // Busco por raza en la base de datos
            
            return pets;
        }
        else{
            const pets = await PetModel.find().exec(); // Busco todas las mascotas en la base de datos
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
    }
    /*
    petByBreed: (_parent: unknown, args: { breed: string }):Pet[] => { // Devuelve todas las mascotas de una raza determinada
        const petsByBreed = pets.filter((pet) => pet.breed === args.breed); // No se lanza error porque puede devolver un array vacío
        return petsByBreed; 
    }
    */
}