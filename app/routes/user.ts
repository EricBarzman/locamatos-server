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
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// Update
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    email,
    address,
    firstname,
    lastname,
  } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, { email, address, firstname, lastname });
    if (!updatedUser) {
      res.status(400).send({ message: "Echec à mettre à jour l'utilisateur" });
      return;
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// Create
router.post("/", async (req: Request, res: Response) => {
  const {
    email,
    address,
    firstname,
    lastname,
    password,
  } = req.body;

  if (email === "" || email === undefined) {
    res.status(400).json({ message: "L'email ne peut être vide" })
    return;
  }

  if (password === "" || password === undefined || password.length < 6) {
    res.status(400).json({ message: "Le mot de passe doit contenir 6 caractères" });
    return;
  }
  const hashedPassword = await makeBCryptPassword(password);

  try {

    const emailAlreadyExists = await UserModel.findOne({ email });
    if (emailAlreadyExists) {
      res.status(500).json({ message: "Cet email est déjà enregistré" });
      return;
    }

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      address: address || "",
      firstname: firstname || "",
      lastname: lastname || "",
    })

    newUser.save();
    res.status(200).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted)
      res.status(404).send({ message: "Echec à supprimer la catégorie" });

    res.status(200).json({ message: "Utilisateur bien supprimé" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})


// Register
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, address, firstname, lastname } = req.body;

  if (email === "" || email === undefined) {
    res.status(404).json({ message: "L'email ne peut être vide" })
    return;
  }

  if (password === "" || password === undefined || password.length < 6) {
    res.status(404).json({ message: "Le mot de passe doit contenir 6 caractères" });
    return;
  }

  const hashedPassword = await makeBCryptPassword(password);

  try {

    const emailAlreadyExists = await UserModel.findOne({ email });
    if (emailAlreadyExists) {
      res.status(403).json({ message: "Cet email est déjà enregistré" });
      return;
    }

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      address: address || "",
      firstname: firstname || "",
      lastname: lastname || "",
    })

    newUser.save();
    const token = createJSONWebToken(newUser._id, email);
    res.status(200).json({ isLogged: true, token });

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
      res.status(401).json({ message: "Cet email ne correspond à aucun utilisateur connu" })
      return;
    }

    const hashedPassword = user.password;
    if (!await compareBCryptPassword(password, hashedPassword)) {
      res.status(401).json({ message: "Mot de passe incorrect" })
      return;
    }

    const token = createJSONWebToken(user._id, email);
    res.status(200).json({ isLogged: true, token })

  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// Reset Password
router.post("/reset-password/", async (req: Request, res: Response) => {
  const { id, password } = req.body;

  if (password === "" || password === undefined) {
    res.status(403).send({ message: "Le mot de passe doit contenir 6 caractères" })
  }

  const newHashedPassword = makeBCryptPassword(password);

  try {
    const user = await UserModel.findByIdAndUpdate(id, { password: newHashedPassword });
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