
  <!-- <% if(successMsg.length){ %>
    <div class="toast align-items-center w-100" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body text-success bg-body-success">
          <%= successMsg %>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  <% } %> -->


  step - 1 (express-session)

  1 - install from npmjs
  2 - const session = require("express-session") 
  3 - take readymade app.use session code 

  app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000* 60 * minutes }
}))

step - 2 (passport authentication)

1 - npm i passport, passport-local
2 - make middleware

2.1 (inside passport middleware)

1 - const passport = require("passport"); //import passport middleware
2 - const LocalStrategy = require("passport-local").Strategy; //import passport-local middleware
3 - const userModel = require("../models/userModel"); //import the Model containing username and password

2.2 (passport.use)
1 - it takes a function - passport.use(new LocalStrategy())
2 - inside that function add a callback Function containing 3 parameters (username, password, done).
2.1 - keep the function as async because we are working with mongodb
3 - find user from database note. use await
4 - if user is found and password is correct then pass done(null, user)
5 - if either user is not found or password is incorrect then : return done(null, false)

2.3 once the user is found we must serialize and deserialize the user. 

2.3.1 (passport.serialize())
- it takes a callback function (user, done) and return (null, user.id)

2.3.2 (passport.desrialize())
- it takes a callback function (id, done) 
- in this function we are finding user from database so we must keep it async await. 

step - 3
-note. we must include passport middleware code. 
inside the index.js file.. below the app.use(session)

we have to keep
1 - app.use(passport.session)
2 - app.use(passport.initialize)

step - 4
inside the router we must use passportjs methods to authenticate the user. also we must add middlewares to protect the different routes of our website. 

----inside the post route of login. ----

router.post("/login", 

  //passport middleware will be used as 2nd parameter

  1- passport.authenticate(
    local, //-1 takes the name of the strategy
    {      //-2 an object for success and failure
      successRedirect: "/home",
      failureRedirect" "/login"
    }
  )
)


note -- authentication alone does not stop anyone from accessing other routes. 

step - 5 Now we must protect the different pages of our website. except login and signup

5.1 - inside the passport middleware. add a method named passport.userAuth
5.2 - userAuth method is a callback function()

this is the code
passport.userAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect("/login");
}

step -6 

now use router.use(passport.userAuth)
- any route that u think should not be opened without the user being authenticated should be kept below the router.use(passport.userAuth)

- any route that is okay to be opened without authentication can be kept above middleware. 

- for e.g., 

signup
login
forgot password

securrity guard middleware to protect user's pages

homepage
personal account
add blog
edit and so on
logout

step - 7 for logout. 

1 - simply type 
module.exports.logout = (req, res)=>{
    req.logOut(()=>{
        return res.redirect("/login");
    }