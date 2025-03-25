const Blog = require("../models/blogmodel");
const fs = require("fs");
const userCred = require("../models/pwShema");

module.exports.homePage = async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find();
    return res.render("index", { blogs });
  } catch (error) {
    console.log(error.message);
    return res.render("index", { blogs: [] });
  }
};

module.exports.formPage = (req, res) => {
  return res.render("pages/form");
};

// Create DataBase

module.exports.create = async (req, res) => {
  try {
    await Blog.create({ ...req.body, image: req.file.path });
    req.flash("success", "Blog Added successfully");
    return res.render("pages/form");
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// Delete Blog

module.exports.blogDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    fs.unlinkSync(blog.image);
    console.log("Blog deleted successfully");
    return res.redirect("/homePage");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/homePage");
  }
};

// Edite Blog

module.exports.blogEdit = async (req, res) => {
  try {
    let { id } = req.params;
    let blog = await Blog.findById(id);
    return res.render("./pages/edit.ejs", { blog });
  } catch (error) {
    console.log(error.message);
    return res.render("./pages/edit.ejs", { blog: {} });
  }
};

module.exports.blogUpdate = async (req, res) => {
  try {
    let { id } = req.params;
    let updateBlog = { ...req.body };

    if (req.file) {
      let blog = await Blog.findById(id);
      if (blog.image) {
        fs.unlinkSync(blog.image);
      }
      updateBlog.image = req.file.path;
    } else {
      updateBlog.image = req.body.old_image;
    }
    await Blog.findByIdAndUpdate(id, updateBlog);
    res.redirect("/homePage");
  } catch (error) {
    console.log(error.message);
    res.redirect("/homePage");
  }
};

// Blog View

module.exports.view = async (req, res) => {
  let { id } = req.params;
  const blogs = await Blog.findById(id);
  return res.render("pages/blogView", { blogs });
};

// SingUp

module.exports.singUp = (req, res) => {
  return res.render("pages/singUp");
};

// Login

module.exports.login = (req, res) => {
  return res.render("pages/login");
};

module.exports.loginFlash = (req, res) => {
  req.flash("success", "Login Successful!");
  return res.redirect("/homePage");
};

// Authentication
module.exports.createCred = async (req, res) => {
  let { password, confirmPw } = req.body;
  if (password === confirmPw) {
    await userCred.create(req.body);
    res.render("./pages/login", req.body);
  } else {
    console.log("Password & Confirm Password should be same!");
    res.render("./pages/singUp", req.body);
  }
};

module.exports.logOut = (req, res) => {
  req.flash("success", "User logged out, cookie removed.");
  return res.redirect("/login");
};

module.exports.profile = (req, res) => {
  return res.render("pages/profile");
};

module.exports.changePasswordPage = (req, res) => {
  return res.render("pages/change-password");
};

module.exports.submitChangePassword = async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const { id } = req.user;
  let user = await userCred.findById(id);

  if (current_password === user.password) {
    if (new_password === confirm_password) {
      user.password = new_password;
      await user.save();
      req.flash("success", "Pasword Change successFully");
      return res.redirect("/login");
    } else {
      req.flash("error", "New password & Confirm Password is not match");
      return res.redirect(req.get("Referrer") || "/");
    }
  } else {
    req.flash("error", "Current Password is not match");
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.contactPage = (req, res) => {
  return res.render("pages/contact");
};

module.exports.aboutPage = (req, res) => {
  return res.render("pages/about");
};

module.exports.forgotPassword = (req, res) => {
  return res.render("pages/forgotPassword");
};

module.exports.verifyOtp = (req, res) => {
  return res.render("pages/verifay");
};

module.exports.setPassword = (req, res) => {
  return res.render("pages/setPassword");
};

module.exports.verifyEmail = async (req, res) => {
  try {
    let user = await userCred.findOne({ email: req.body.email });
    if (user) {
      return res.json({ message: `${user.username} is successfuly verifid` });
    } else {
      return res.json({ message: "User not Found" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};
