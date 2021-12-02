import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";

// @desc    Fetch all Blogs
// @route    GET /api/BLogs
// @access    Public
export const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

// @desc    get single Blogs
// @route    GET /api/BLogs/:id
// @access    Public
export const getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.status(200).json({
      success: true,
      data: blog,
    });
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});
