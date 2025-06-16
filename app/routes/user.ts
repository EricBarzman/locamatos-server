import { Router, Request, Response } from "express";
import { UserModel } from "../models/user.model";

const router = Router();

// Get All
router.get("/", async (_, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }

})

export { router as userRouter };