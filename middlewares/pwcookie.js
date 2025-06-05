const password_cookie = (req,res,next) => {
  if(req.cookies.email){
   return next();
  }
  return res.json({message : "enter your email first"});;
} 
module.exports = password_cookie;