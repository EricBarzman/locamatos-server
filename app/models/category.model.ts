import { Schema, model } from "mongoose";
import { ICategory, ISubCategory } from "../types/category.type";

const CategorySchema = new Schema<ICategory>({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
  }
});

const SubCategorySchema = new Schema<ISubCategory>({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
  }
});

export const SubCategoryModel = model<ISubCategory>("subCategory", SubCategorySchema);
export const CategoryModel = model<ICategory>("category", CategorySchema);