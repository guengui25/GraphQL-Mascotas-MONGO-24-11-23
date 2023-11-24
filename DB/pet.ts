import mongoose from "mongoose";
import { Pet } from "../types.ts";

const Schema = mongoose.Schema; // Esquema de la base de datos

const PetSchema = new Schema( // Esquema de la colección
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
  },
  { timestamps: true }
);

export type PetModelType = mongoose.Document & Omit<Pet,"id">; // Tipo de la colección

export default mongoose.model<PetModelType>( // Modelo de la colección
  "Pets", // Nombre de la colección
  PetSchema // Esquema de la colección
);