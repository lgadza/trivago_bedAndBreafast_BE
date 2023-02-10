import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AccommodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: String, required: true },
    description: { type: String, required: false },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Accommodation", AccommodationsSchema);
