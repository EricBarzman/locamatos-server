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

// Get one
router.get("/:id", async (req: Request, res: Response) => {

  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).send({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json({
      user: {
        email: user.email,
        username: user.username,
        avatarPath: user.avatarPath || ""
      }
    });

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
    if (!updatedUser) {
      res.status(404).send({ message: "Echec à mettre à jour l'utilisateur" });
      return;
    }

    res.status(200).send({ user : {
      email: updatedUser.email,
      username: updatedUser.username,
      avatarPath: updatedUser.avatarPath || ""
    }});

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})


// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, avatarPath } = req.body;

  if (email === "" || email === undefined) {
    res.status(404).json({ message: "L'email ne peut être vide" })
    return;
  }

  if (username === "" || username === undefined) {
    res.status(404).json({ message: "Le nom d'utilisateur ne peut être vide" })
    return;
  }

  if (password === "" || password === undefined || password.length < 6)
    res.status(404).json({ message: "Le mot de passe doit contenir 6 caractères" })

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
      res.status(401).send({ message: "Cet email ne correspond à aucun utilisateur connu" })
      return;
    }

    const hashedPassword = user.password;
    if (!await compareBCryptPassword(password, hashedPassword)) {
      res.status(401).send({ message: "Mot de passe incorrect" })
      return;
    }

    const token = createJSONWebToken(user._id, email);
    res.status(200).send({ isLogged: true, token })

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// Reset Password
router.post("/reset-password/", async (req: Request, res: Response) => {
  const { _id, password } = req.body;

  if (password === "" || password === undefined) {
    res.status(403).send({ message: "Le mot de passe doit contenir 6 caractères" })
  }

  const newHashedPassword = makeBCryptPassword(password);

  try {
    const user = await UserModel.findByIdAndUpdate(_id, { password: newHashedPassword });
    if (!user) {
      res.status(500).send({ message: "Utilisateur introuvable" })
      return;
    }

    res.status(200).send({ message: "Le mot de passe a bien été mis à jour" })

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})



export { router as userRouter };