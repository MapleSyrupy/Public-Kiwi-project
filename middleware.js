const express = require("express");
const errorSchema = require("./ErrorHandling/ErrorSchema")
const app = express()
app.set("view engine","ejs")
module.exports =  (req, res, next) => {
    const { error } = errorSchema.validate(req.body);
    if (error) {
      return next(error)
    }
    next();
  };
  
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.user){
    return res.redirect("/productivity/login")
}else{
    next();
}
}

module.exports.pageTracker = (req,res,next)=>{
  if(req.originalUrl){
  req.session.returnTo = req.originalUrl;
  }
  next()
}