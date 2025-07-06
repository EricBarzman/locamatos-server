import { Schema, model } from "mongoose";
import { IUser } from "../types/user.type";

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarPath: {
    type: String,
    required: false,
  }
});

export const UserModel = model<IUser>("user", UserSchema);