import { Pet } from "../types.ts"; // Importo el tipo de typescript

import { GraphQLError } from "graphql"; // Importo el tipo de error de graphql

import PetModel from "../DB/pet.ts"; // Importo el modelo de la base de datos


export const Mutation = {

    addPet: async (_: unknown, args: {name: string; breed: string }) => {
        try{
            if(!args.name || !args.breed){
                throw new GraphQLError("Name and breed are required fields", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

            const newPet = new PetModel({ name: args.name, breed: args.breed}); // Creo una nueva mascota con los datos dados

            await newPet.save(); // Guardo la mascota en la base de datos

            return newPet; // Devuelvo la mascota guardada
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
            const pet = await PetModel.findByIdAndDelete(args.id).exec(); // Busco la mascota por id y la elimino

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