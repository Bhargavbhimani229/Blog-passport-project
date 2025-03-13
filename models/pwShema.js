const { default: mongoose } = require("mongoose");

const blogPw = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    confirmPw: String,
  },
  { timestamps: true }
);

const userCred = mongoose.model("userCred",blogPw);

module.exports = userCred;