export interface ICategory {
  nom: string;
  slug: string;
  subcategories: ISubCategory;
}

export interface ISubCategory {
  nom: string;
  slug: string;
}