const express = require("express");
const router = express.Router();
const dateTime = require("date-and-time");
const {pageTracker} = require("../middleware.js")
const WrapAsync = require("../ErrorHandling/WrapAsync.js");
const toDoes = require("../Models/todoSchema.js");

router.route("/")
.get(pageTracker,WrapAsync(async (req,res)=>{
    // let dataLength = data.length;
    // let calculate = (x,y)=>{
    //     let calc1 = x/y;
    //     let calc2 = calc1*100
    //     return Math.floor(calc2)
    // }
    // let percents = await toDoes.find({author:req.user._id,checked:true})
    // let percentsLength = percents.length;
    // const percentage = (calculate(percentsLength,dataLength));
    const found =await  toDoes.find({author:req.user._id});
    const newDate = new Date()
    const formattedDate = dateTime.format(newDate,"YYYY/MM/DD HH:mm");
    console.log(found)
    if(found){
    for(todo of found){
    const newDate2 = todo.date.replaceAll("-","/")
    const parsedDate2 = dateTime.parse(`${newDate2} ${todo.time}`,"YYYY/MM/DD HH:mm");
    const formattedDate2 = dateTime.format(parsedDate2,"YYYY/MM/DD HH:mm");
    console.log(formattedDate)
    console.log(formattedDate2)
    if(formattedDate2<=formattedDate){
       await toDoes.findByIdAndUpdate(todo._id,{isValid:false});
    }
    }
}   
res.render("./ToDoList/ToDoList",{data,darkMode})
}))
router.post("/:id/important", WrapAsync(async(req,res)=>{
let data= req.params.id
const found = await toDoes.findById(data)
if(found.isImportant === false){
    const found1 = await toDoes.findByIdAndUpdate(data,{isImportant: true})
    res.send(found1)
}else{
    const found2 = await toDoes.findByIdAndUpdate(data,{isImportant: false})
    res.send(found2)
}

}));
router.get("/important",WrapAsync(async(req,res)=>{
    let darkMode = req.session.darkMode;
    const data = await toDoes.find({author:req.user._id,isImportant:true})
    res.render("./ToDoList/ImportantTodo",{data,darkMode})
}))

module.exports = router;