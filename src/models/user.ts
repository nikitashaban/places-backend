import mongoose, { Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { IPlace } from "./place";

const Schema = mongoose.Schema;

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: Array<IPlace>;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

UserSchema.plugin(uniqueValidator);

export const User = mongoose.model<IUser>("User", UserSchema);
