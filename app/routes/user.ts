import { Router, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { compareBCryptPassword, makeBCryptPassword } from "../utils/bcrypt";
import { createJSONWebToken } from "../utils/jsonwebtoken";

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

// Update
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, { username, email });
    if (!updatedUser)
      res.status(404).send({ message: "Echec à mettre à jour l'utilisateur" });

    res.status(200).send(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})


// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, avatarPath } = req.body;

  if (email === "" || email === undefined) {
    res.status(404).json({ message: "Email cannot be empty" })
    return;
  }

  if (username === "" || username === undefined) {
    res.status(404).json({ message: "Username cannot be empty" })
    return;
  }

  if (password === "" || password === undefined || password.length < 6)
    res.status(404).json({ message: "Password must be more than 6 characters long" })

  const hashedPassword = await makeBCryptPassword(password);

  try {
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword
    })

    newUser.save();
    const token = createJSONWebToken(newUser._id, email);
    res.status(200).send({ isLogged: true, token });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})


// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).send({ message: "Cet email ne correspond à aucun utilisateur connu"})
      return;
    }

    const hashedPassword = user.password;
    if (!await compareBCryptPassword(password, hashedPassword)) {
      res.status(401).send({ message: "Mot de passe incorrect"})
      return;
    }

    const token = createJSONWebToken(user._id, email);
    res.status(200).send({ isLogged: true, token })

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})


export { router as userRouter };