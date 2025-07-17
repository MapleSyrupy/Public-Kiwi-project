const express = require("express");
const router = express.Router()
const passport = require("passport");
router.route("/")
.get((req,res)=>{
    res.render("./login")
})
.post(passport.authenticate("local"),(req,res)=>{
if(req.user){
   res.send(req.user._id)
    }else{
        res.status(401).send("User not Found")
    }
})
module.exports = router;