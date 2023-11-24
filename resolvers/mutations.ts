import { Pet } from "../types.ts"; // Importo el tipo de typescript

import { GraphQLError } from "graphql"; // Importo el tipo de error de graphql

import PetModel from "../DB/pet.ts"; // Importo el modelo de la base de datos

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

    addPet: async (_: unknown, args: {name: string; breed: string }) => {
        try{

            if(!args.name || !args.breed){
                throw new GraphQLError("Name and breed are required fields", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const newPet = new PetModel({ name: args.name, breed: args.breed});

            await newPet.save();

            return newPet;
        }
        catch(error){
            console.error(error);
            throw new GraphQLError(`Error saving pet with name ${args.name}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },

    deletePet: async (_: unknown, args: { id: string }) => {

        try{
            const pet = await PetModel.findByIdAndDelete(args.id).exec(); // Busco el dni de X en la base de datos

            if(!pet){
                throw new GraphQLError(`No pet found with id ${args.id}`, {
                    extensions: { code: "NOT_FOUND" },
                });
            }

            return pet;
        }
        catch(error){
            console.error(error);
            throw new GraphQLError(`Error deleting pet with id ${args.id}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },

    updatePet: async (_: unknown, args: { id: string; name: string; breed: string }) => {
        
        try{
            if(!args.id || !args.name || !args.breed){
                throw new GraphQLError("Name and breed are required fields", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const updatedPet = await PetModel.findByIdAndUpdate( // Actualizo la persona con el dni dado
                args.id , // Busco la persona con el dni dado

                { name: args.name, breed: args.breed }, // Actualizo los datos de la mascota

                { new: true } // Con new: true, devuelvo la persona actualizada

                ).exec(); // Ejecuto la funcion

            /*
            if(!updatedPet){
                throw new GraphQLError(`No pet found with id ${args.id}`, {
                    extensions: { code: "NOT_FOUND" },
                });
            */
            
            }

            return updatedPet;
        }
        catch(error){
            console.error(error);
            throw new GraphQLError(`Error updating pet with id ${args.id}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },
};