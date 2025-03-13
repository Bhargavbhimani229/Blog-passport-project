const blogRedirect = (req,res,next) =>{
  if(req.url === '/')
  {
    return res.redirect('/homePage');
  }
  return next();
}

module.exports = blogRedirect;