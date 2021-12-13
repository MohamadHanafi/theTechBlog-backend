import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import colors from "colors";

import path from "path";

import blogsRouters from "./routes/blogsRoutes.js";
import usersRouters from "./routes/usersRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// middleware
import { notFound, errorHandler } from "./middleware/errorsMiddleware.js";

dotenv.config();

connectDb();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/blogs", blogsRouters);

app.use("/api/users", usersRouters);

app.use("/api/upload", uploadRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/the-tech-blog/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../the-tech-blog/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("api running");
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold);
});
