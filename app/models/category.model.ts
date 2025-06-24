import { Schema, SchemaTypes, model } from "mongoose";
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
  },
  category: {
    type: SchemaTypes.ObjectId,
    ref: 'category',
    required: true,
  }
});

export const SubCategoryModel = model<ISubCategory>("subcategory", SubCategorySchema);
export const CategoryModel = model<ICategory>("category", CategorySchema);