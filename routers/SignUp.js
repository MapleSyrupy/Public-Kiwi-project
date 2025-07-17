const express = require("express");
const router = express.Router()
const passport = require("passport");
const user = require("../Models/userSchema")
router.route("/")
.get((req,res)=>{
    res.render("./login")
})
.post(passport.authenticate("local",{failureRedirect:"http://localhost:5173/signIn"}), async(req,res)=>{

}) 

module.exports = router;