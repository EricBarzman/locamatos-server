import { Router } from "express";
import { productRouter } from "./routes/product";
import { userRouter } from "./routes/user";
import { categoryRouter } from "./routes/categories";
import { subcategoryRouter } from "./routes/subCategories";

const router = Router();
router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);

export default router;