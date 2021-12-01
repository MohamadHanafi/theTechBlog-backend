import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import colors from "colors";

dotenv.config();

connectDb();

const app = express();

if (process.env.NODE_MODE === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold);
});
