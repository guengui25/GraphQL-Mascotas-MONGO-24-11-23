import mongoose from "mongoose";
import { Pet } from "../types.ts";

const Schema = mongoose.Schema;

const PetSchema = new Schema(
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
  },
  { timestamps: true }
);

export type PetModelType = mongoose.Document & Omit<Pet,"id">;

export default mongoose.model<PetModelType>(
  "Pets", // Nombre de la colección
  PetSchema // Esquema de la colección
);