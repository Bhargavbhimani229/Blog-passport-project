const passport = require("passport");
const userCred = require("../models/pwShema");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userCred.findOne({ username });
      if (user) {
        if (user.password == password) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  let user = await userCred.findById(id);
  return done(null, user);
});

passport.userPassportAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  return next();
};

passport.userLocalsData = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  return next();
};

passport.sweetFlash = (req, res, next) => {
  // console.log("Hello flash");
  res.locals.flash = {
    success: req.flash("success"), // Fetch & remove from session
    error: req.flash("error"),
  };
  next();
};

module.exports = passport;
