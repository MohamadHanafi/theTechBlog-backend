import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

// @desc    Fetch all Blogs
// @route    GET /api/BLogs
// @access    Public
export const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json(blogs);
});

// @desc    get single Blogs
// @route    GET /api/BLogs/:slug
// @access    Public
export const getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate({
    path: "user",
    select: "name",
  });
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

// @desc    Create a blog
// @route    GET /api/BLogs/:id
// @access    private (admin and publisher)
export const createBlog = asyncHandler(async (req, res, next) => {
  // set user to req.user._id
  req.body.user = req.user._id;

  if (!req.body.image) {
    req.body.image = "./BlogImages/blog1.jpg";
  }
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
});

// @desc    Get Bookmarked Blogs
// @route    GET /api/users/:id/bookmarks
// @access    private
export const getBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const bookmarks = await Blog.find({
    _id: { $in: user.bookmarks },
  }).sort({ createdAt: -1 });

  if (bookmarks.length === 0) {
    res.status(404);
    throw new Error("No bookmarks found");
  }

  res.status(200).json(bookmarks);
});

// @desc    Edit a Blog
// @route    PUT /api/blogs/:slug
// @access    private (admin and publisher)
export const editBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  // check if the blog is not there
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // check if the user is the owner of the blog or admin
  if (
    blog.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("You are not authorized to edit this blog");
  }

  // update the blog
  console.log(req.body);
  const updateBlog = await Blog.findByIdAndUpdate(blog._id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json(updateBlog);
});

// @desc    Delete a Blog
// @route    DELETE /api/blogs/:slug
// @access    private (admin and publisher)
export const deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  // check if the blog is not there
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // check if the user is the owner of the blog or admin
  if (
    blog.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("You are not authorized to delete this blog");
  }

  // delete the blog
  const deletedBlog = await Blog.findByIdAndDelete(blog._id);

  res.status(200).json(deletedBlog);
});
