import express from "express";
import { getBookmarks } from "../controllers/blogsControllers.js";
import {
  addBookmark,
  deleteUser,
  getUsersList,
  removeBookmark,
  updateUserRole,
} from "../controllers/userControllers.js";
import {
  userLogin,
  updateUser,
  registerUser,
} from "../controllers/userControllers.js";

import protect, { authorize } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(protect, authorize("admin"), getUsersList);

router.route("/login").post(userLogin);

router.route("/profile").put(protect, updateUser);

router
  .route("/:id")
  .delete(protect, authorize("admin"), deleteUser)
  .put(protect, authorize("admin"), updateUserRole);

router.route("/bookmarks").get(protect, getBookmarks);

router
  .route("/:user_id/:blog_id")
  .put(protect, addBookmark)
  .delete(protect, removeBookmark);
export default router;
