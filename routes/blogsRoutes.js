import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
} from "../controllers/blogsControllers.js";
import protect, { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .get("/", getBlogs)
  .post("/", protect, authorize("admin", "publisher"), createBlog);

router.route("/:slug").get(getBlog);

export default router;
