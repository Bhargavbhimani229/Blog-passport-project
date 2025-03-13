const { default: mongoose, model } = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    image: String,
    content: String,
    category: String,
    publishedDate: { type: Date, required: true },
    status: String,
  },
  { timestamps: true }
);

const Blog = mongoose.model("BlogTBL", blogSchema);

module.exports = Blog;
