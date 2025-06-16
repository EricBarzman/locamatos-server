import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product.model";

const router = Router();

// Get All
router.get("/", async (_, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }

})

// Get One by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) res.status(404).send("Produit introuvable");

    res.send(product);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }

})

// Create one
router.post("/", async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel({ ...req.body });
    await newProduct.save();
    res.status(200).send(newProduct);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Update
router.post("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, { ...req.body });
    if (!updatedProduct) res.status(404).send({ message: "Echec à mettre à jour le produit" });

    res.status(200).send(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Delete
router.delete("/id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) res.status(404).send({ message: "Echec à supprimer le produit" });

    res.status(200).send(deletedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export { router as productRouter };