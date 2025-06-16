import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.type";

const ProductSchema = new Schema<IProduct>({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Le prix doit être supérieur à 1"]
  },
  description: {
    type: String,
    required: true,
  },
  imageUrls: [{
    type: String,
  }],
  categories: [{
    type: String,
  }]
});

export const ProductModel = model<IProduct>("product", ProductSchema);