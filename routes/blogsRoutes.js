import express from "express";
import { getBlogs, getBlog } from "../controllers/blogsControllers.js";

const router = express.Router();

router.get("/", getBlogs);

router.route("/:id").get(getBlog);

export default router;
