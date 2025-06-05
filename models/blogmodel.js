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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Blog = mongoose.model("BlogTBL", blogSchema);

module.exports = Blog;
