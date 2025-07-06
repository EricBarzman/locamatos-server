import { Schema, model } from "mongoose";
import { IUser } from "../types/user.type";

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
});

export const UserModel = model<IUser>("user", UserSchema);