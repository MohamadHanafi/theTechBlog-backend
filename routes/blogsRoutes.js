import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  deleteBlog,
} from "../controllers/blogsControllers.js";
import protect, { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .get("/", getBlogs)
  .post("/", protect, authorize("admin", "publisher"), createBlog);

router
  .route("/:slug")
  .get(getBlog)
  .delete(protect, authorize("admin", "publisher"), deleteBlog);

router
  .route("/:slug/edit")
  .put(protect, authorize("admin", "publisher"), editBlog);

export default router;
