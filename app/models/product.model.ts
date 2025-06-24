import { Schema, SchemaTypes, model } from "mongoose";
import { IProduct } from "../types/product.type";

const ProductSchema = new Schema<IProduct>({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: false,
    min: [1, "Le prix doit être supérieur à 1"]
  },
  description: {
    type: String,
    required: false,
  },
  imageUrls: [{
    type: String,
    required: false,
  }],
  category: {
    type: SchemaTypes.ObjectId,
    ref: "category",
    required: true,
  },
  subcategory: {
    type: SchemaTypes.ObjectId,
    ref: "subcategory",
    required: true,
  },
});

export const ProductModel = model<IProduct>("product", ProductSchema);