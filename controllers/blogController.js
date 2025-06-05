const Blog = require("../models/blogmodel");
const fs = require("fs");
const userCred = require("../models/pwShema");
const nodemailer = require("nodemailer");
const { json } = require("body-parser");
require("dotenv").config();

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
  console.log("Login Fail");
  
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

let otp;

module.exports.verifyEmail = async (req, res) => {
  try {
    otp = Math.floor(100000 + Math.random() * 900000);
    let user = await userCred.findOne({ email: req.body.email });
    if (user) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const info = await transporter.sendMail({
        from: `"Maddison Foo Koch 👻" <${process.env.EMAIL_USER}>`, // sender address
        to: req.body.email, // list of receivers
        subject: "Forgot Password OTP", // Subject line
        text: "OTP Verify", // plain text body
        html: `<strong>OTP : ${otp}</strong>`,
      });
      res.cookie ('email',JSON.stringify(req.body.email));
      req.flash("success","Email verify Successfully.");
      return res.redirect("/verify");
      // return res.json({ message: `${user.username} is successfuly verifid` });
    } else {
      req.flash("error","Email is not Match.");

      return res.redirect("/forgotpassword");
      // return res.json({ message: "User not Found" });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};


module.exports.otpVerify = async(req,res) => {
  try {
    if(req.body.otp == otp){
      req.flash("success","OTP verify Successfully.");
      return res.redirect("/setPassword");
    //  return res.json({message: "OTP verify successfully"})
    }
    else{
      req.flash("error","OTP is not Match.");

      return res.redirect("/verify");
      // return res.json({message : "Invalid OTP."});
    }
  } catch (error) {
    return res.json({message : error.message});
  }

}

module.exports.change_password = async(req,res) => {
  try {
    let email = JSON.parse(req.cookies.email);
    let user  = await userCred.findOne({email:email});
    let {new_password,confirm_password} = req.body;
    if(new_password === confirm_password){
      user.password = new_password;
      await user.save();

      req.flash("success","ForgotPassword Successfully.");
      return res.redirect("/login")
      
      // return res.json({message:"password changed successfully."})
    }else{
      req.flash("error","New Password & confirm Password is not Match.");
      return res.redirect("/setPassword")
      // return res.json({message:"password not match"})
    }
  } catch (error) {
    return res.json({message : error.message});
  }

}

module.exports.like = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/homePage");
    }
    blog.likes = (blog.likes || 0) + 1;
    await blog.save();
    req.flash("success", "You liked the blog");
    return res.redirect("/homePage");
  } catch (error) {
    console.error(error.message);
    req.flash("error", "Something went wrong");
    return res.redirect("/homePage");
  }
};

module.exports.dislike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/homePage");
    }
    blog.dislikes = (blog.dislikes || 0) + 1;
    await blog.save();
    req.flash("success", "You disliked the blog");
    return res.redirect("/homePage");
  } catch (error) {
    console.error(error.message);
    req.flash("error", "Something went wrong");
    return res.redirect("/homePage");
  }
};
