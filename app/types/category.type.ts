import { Types } from "mongoose";

export interface ICategory {
  _id?: string;
  nom: string;
  slug: string;
}

export interface ISubCategory {
  _id?: string;
  nom: string;
  slug: string;
  category: Types.ObjectId;
}