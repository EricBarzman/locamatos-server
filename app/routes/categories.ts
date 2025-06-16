import { Router, Request, Response } from "express";
import { CategoryModel } from "../models/category.model";
import slugify from "../utils/slugify";

const router = Router();

// Get All
router.get("/", async (_, res: Response) => {
  try {
    const categories = await CategoryModel.find({});
    res.send(categories);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Get one by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findById(id);
    if (!category) res.status(404).send({ message: "Catégorie introuvable" })
    res.status(200).send(category);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Create one
router.post("/", async (req: Request, res: Response) => {
  const { nom } = req.body;
  const slug = slugify(nom);

  try {
    const newCategory = new CategoryModel({ nom, slug })
    const result = await newCategory.save();
    if (!result) res.status(404).send({ message: "Echec à créer la catégorie" })

    res.status(200).send({ message: "Catégorie bien créée " });

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Update
router.post("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nom } = req.body;
  const slug = slugify(nom);

  const newData = { nom, slug };

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, newData);
    if (!updatedCategory) res.status(404).send({ message: "Echec à mettre à jour la catégorie" });

    res.status(200).send(updatedCategory);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Delete
router.delete("/id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) res.status(404).send({ message: "Echec à supprimer la catégorie" });

    res.status(200).send(deletedCategory);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export { router as categoryRouter };