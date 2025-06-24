import { Types } from "mongoose"

export interface IProduct {
  _id?: string;
  nom: string;
  description: string;
  imageUrls: string[];
  price: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
}
