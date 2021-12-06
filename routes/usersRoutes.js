import express from "express";
import {
  userLogin,
  updateUser,
  registerUser,
} from "../controllers/userControllers.js";

import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);

router.route("/login").post(userLogin);

router.route("/profile").put(protect, updateUser);

export default router;
