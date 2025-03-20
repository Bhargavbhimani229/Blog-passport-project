const express = require("express");
const db = require("./configs/database");
// const blogRedirect = require("./middlewares/blogRedirect");
const LocalStrategy = require("./middlewares/passport-local");
const passport = require('passport');
const flash = require('connect-flash');
const session = require("express-session");
const bodyParser = require("body-parser");
// const flashMessage = require("./middlewares/flashMessage");

const port = 8095;

const app = express();

app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie : {maxAge : 1000 * 60 * 60}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(passport.userLocalsData);

app.use(passport.sweetFlash);
// app.use(flashMessage());

// app.use(blogRedirect);
app.use("/uploads",express.static(__dirname + '/uploads'));


app.use("/",require("./routers"));

app.listen(port, (err) => {
  
  if (!err) {
    db();
    console.log("server runs on\nhttp://localhost:" + port);
  }
});