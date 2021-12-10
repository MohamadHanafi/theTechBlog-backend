import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
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
// @route    POST /api/users/profile
// @access    private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;
  const user = await User.findById(req.user._id);
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

// @desc    update users info
// @route    POST /api/users
// @access    private
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser._id),
  });
});

// @desc    Get all users
// @route    get /api/users
// @access    private/admin
export const getUsersList = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc    Delete User
// @route    delete /api/users/:id
// @access    private/admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    res.status(404);
    throw new Error("user is not found");
  }

  const deletedUser = await User.findByIdAndRemove(req.params.id);

  res.status(202).json(deletedUser);
});

// @desc    Update User
// @route    put /api/users/:id
// @access    private/admin
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// @desc    add book mark
// @route    put /api/users/:user_id/:blog_id
// @access    private
export const addBookmark = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  const { blog_id } = req.params;

  const user = await User.findById(user_id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const blog = await Blog.findById(blog_id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (!user.bookmarks) {
    user.bookmarks = [];
    console.log(user.bookmarks);
  }

  if (user.bookmarks.includes(blog_id)) {
    res.status(400);
    throw new Error("Blog is already bookmarked");
  }

  user.bookmarks.push(blog_id);
  await user.save();

  res.status(200).json(blog);
});
