import { Pet } from "../types.ts"; // Importo el tipo de typescript

import { GraphQLError } from "graphql"; // Importo el tipo de error de graphql

import PetModel from "../DB/pet.ts"; // Importo el modelo de la base de datos


export const Query = {

    pets: async (_parent: unknown, args: {breed?: string}): Promise<Pet[]> => { // Devuelve todas las mascotas -> Puede recibir una raza y devolver el array de mascotas solo de esa raza
        
        if(args.breed){ // Si recibe una raza
            const pets = await PetModel.find({breed: args.breed}).exec(); // Busco por raza en la base de datos
            
            const petsGraphql = pets.map((pet) => { // Mapeo las mascotas de la base de datos a las mascotas de graphql
                return {
                    id: pet.id,
                    name: pet.name,
                    breed: pet.breed,
                }
            })

            return petsGraphql;
        }
        
        // Si no recibe una raza
        const pets = await PetModel.find().exec(); // Busco todas las mascotas en la base de datos
        
        const petsGraphql = pets.map((pet) => { // Mapeo las mascotas de la base de datos a las mascotas de graphql
            return {
                id: pet.id,
                name: pet.name,
                breed: pet.breed,
            }
        })
        return petsGraphql;

    },

    pet: async (_parent: unknown, args: { id: string }) => {  // Devuelve una mascota por id -> Recibe un id de tipo ID! y SIEMPRE va a devolver un ID
        
        const pet_id = await PetModel.findOne({_id: args.id}).exec(); // Busca la mascota por id en la base de datos

        if (!pet_id) {
            throw new GraphQLError(`No pet found with id ${args.id}`, { // Si no encuentra la mascota lanza un error, ya que SOLO puede devolver un Pet (por la exclamación del esquema)
            extensions: { code: "NOT_FOUND" },
            });
        }

        return pet_id;
    }
}