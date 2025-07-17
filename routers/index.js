const express= require("express");
const router = express.Router();
const JoiError = require("../middleware.js")
const {isLoggedIn} = require("../middleware.js");
const WrapAsync = require("../ErrorHandling/WrapAsync.js");
const toDoes = require("../Models/todoSchema.js");
const {pageTracker} = require("../middleware.js")

router.route("/")
.get(pageTracker,isLoggedIn,WrapAsync(async (req,res)=>{ 
    let darkMode = req.session.darkMode;
    res.render("./index",{darkMode});
}))
router.route("/:id")
.get(pageTracker,WrapAsync(async(req,res)=>{
    let darkMode = req.session.darkMode;
    let data = req.params.id;
    let found = await toDoes.findById(data)
    res.render("./show",{found,darkMode})
}))

router.get("/:id/edit",pageTracker,WrapAsync(async (req,res)=>{
    let darkMode = req.session.darkMode;
    const data = req.params.id;
    const found = await toDoes.findById(data)
    res.render("./edit",{found,darkMode})
}))
router.delete("/delete/:id",async(req,res)=>{
    let data = req.params;
    const deleted = await toDoes.findByIdAndDelete(data.id);
    res.send(deleted)
})
router.delete("/:id/important/delete",async(req,res)=>{
    let data = req.params;
    await toDoes.findByIdAndDelete(data.id);
    res.redirect("/productivity/ToDo/important")
})
router.post("/checked",async(req,res)=>{
if(req.isAuthenticated()){
    const user = req.user;
    const {data} = req.body;
    const foundTodo = await toDoes.findOneAndUpdate({author:user._id,_id:data},{checked:true}) //remember to remove the author check, it is unneccesary
    res.send(foundTodo)
    }else{
        res.status(401).send("OH NO"
        )
    }
})
router.post("/:id/unchecked",async(req,res)=>{
    if(req.isAuthenticated()){
    let data = req.params;
    const founc = await toDoes.findByIdAndUpdate(data.id,{checked:false})
    res.send(founc)
    }else{
        res.status(401).send("oh NO")
    }
})
router.post("/edit/:id",async(req,res)=>{
    const data = req.params;
    const value = req.body;
    const found =  await toDoes.findByIdAndUpdate(data.id,{...value})
    res.send(found)
})
module.exports = router;