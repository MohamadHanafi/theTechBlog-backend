import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import Blog from "./models/blogModel.js";
import User from "./models/userModel.js";
import connectDb from "./config/db.js";

import { blogs } from "./data/blogs.js";
import { users } from "./data/users.js";

dotenv.config();

connectDb();

const importData = async () => {
  try {
    await Blog.deleteMany();
    await User.deleteMany();

    const sampleUsers = await User.insertMany(users);

    const admin = users.filter((user) => user.role === "admin")[0];
    const adminId = admin._id;

    const updatedBlogs = blogs.map((blog) => {
      return { ...blog, user: adminId };
    });

    const sampleBlogs = await Blog.insertMany(updatedBlogs);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Blog.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
