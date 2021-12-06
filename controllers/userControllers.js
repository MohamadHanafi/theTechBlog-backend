import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Find and Auth users
// @route    POST /api/users/login
// @access    Public
export const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  // Check for user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email");
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  // Create token
  const token = generateToken(user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

// @desc    update users info
// @route    POST /api/users/updateuser
// @access    private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.password = password || user.password;

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});
