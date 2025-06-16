import { configDotenv } from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./router";

configDotenv();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(router);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING!)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error(err))

app.listen(port, () => console.log(`Server is running on port: ${port}`));