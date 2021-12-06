import express from "express";
import { userLogin, updateUser } from "../controllers/userControllers.js";

import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/login").post(userLogin);

router.route("/updateuser").put(protect, updateUser);

export default router;
