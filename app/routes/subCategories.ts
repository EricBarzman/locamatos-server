import { Router, Request, Response } from "express";
import { SubCategoryModel } from "../models/category.model";
import slugify from "../utils/slugify";

const router = Router();

// Get All
router.get("/", async (_, res: Response) => {
  try {
    const subcategories = await SubCategoryModel.find({});
    res.send(subcategories);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Get one by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const subcategory = await SubCategoryModel.findById(id).populate("category");
    if (!subcategory) res.status(404).send({ message: "Sous-catégorie introuvable" });

    res.status(200).send(subcategory);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Create one
router.post("/", async (req: Request, res: Response) => {
  const { nom, category } = req.body;
  const { _id } = category;
  const slug = slugify(nom);
  
  const newData = { nom, slug, category: _id };
  
  try {
    const newSubCategory = new SubCategoryModel(newData)
    const result = await newSubCategory.save();
    if (!result) res.status(404).send({ message: "Echec à créer la sous-catégorie" })

    res.status(200).send({ message: "Sous-catégorie bien créée " });

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nom, category } = req.body;
  const { _id } = category;
  const slug = slugify(nom);

  const newData = { nom, slug, category: _id }
  
  try {
    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(id, newData);
    if (!updatedSubCategory) res.status(404).send({ message: "Echec à mettre à jour la sous-catégorie" });

    res.status(200).send(updatedSubCategory);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);
    if (!deletedSubCategory) res.status(404).send({ message: "Echec à supprimer la sous-catégorie" });

    res.status(200).send(deletedSubCategory);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export { router as subcategoryRouter };