import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface IPlace extends Document {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  creator: string;
}

const PlaceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

export const Place = mongoose.model<IPlace>("Place", PlaceSchema);
