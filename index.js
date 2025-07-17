const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const toDoes = require("./Models/todoSchema.js")
const methodOverride = require("method-override")
const ExpressError = require("./ErrorHandling/ExpressError")
const path = require("path")
const JoiError = require("./middleware.js");
const userSchema = require("./Models/userSchema.js");
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy
const passport = require("passport");
const app = express();
const indexes = require("./routers/index.js");
const WrapAsync = require("./ErrorHandling/WrapAsync.js");
const loginout = require("./routers/loginout.js");
const news = require("./routers/new.js");
const MongoStore = require("connect-mongo");
const {pageTracker} = require("./middleware.js")
const dated = require("date-and-time")
const toDo = require("./routers/toDo.js");
const cors = require("cors");
const todoSchema = require("./Models/todoSchema.js");
app.set("view engine","ejs");
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views",path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret: "secret",
    sameSite:"none",
    resave: false ,
    saveUninitialized: true,
    store:MongoStore.create(({
         mongoUrl: 'mongodb://127.0.0.1:27017/ToDoList'
    }))
  }));

const corsOptions = {
    origin:["http://localhost:5173"],
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))
passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());
app.use(passport.authenticate("session"))

app.use("/productivity/index",indexes);
app.use("/productivity/login",loginout);
app.use("/productivity/new",news);
app.use("/productivity/toDo", toDo)
app.get("/productivity/start",(req,res)=>{
    res.render("./starting/start")
})

app.get("/productivity/user",(req,res)=>{
    if (req.isAuthenticated()) {
        res.send({ user: req.session.passport.user });
      } else {
        res.status(401).send({ message: 'Not authenticated' });
      }
})
app.get("/productivity/toDoes",async (req,res)=>{
    if(req.isAuthenticated()) {
       
        let user = req.user;
        const found = await todoSchema.find({author:user._id});
        const newDate = new Date()
        const formattedDate = dated.format(newDate,"YYYY/MM/DD HH:mm");
        for(let dates of found){
          if(dates.time !== "" && dates.date !==""){
            const newDate2 = dates.date.replaceAll("-","/")
            const formattedDate2 = dated.parse(`${newDate2} ${dates.time}`, "YYYY/MM/DD HH:mm")
            const finalFormat = dated.format(formattedDate2,"YYYY/MM/DD HH:mm")
            if(finalFormat<=formattedDate  && !dates.checked || !dates.checked=== true){
              await todoSchema.findByIdAndUpdate({_id:dates._id},{isLate:true})
            }
          }
        }
        res.send(found)
    }
})
app.get("/productivity/register",WrapAsync(async(req,res)=>{
    if(!req.user){
    res.render("./register.ejs")
    }else{
        res.redirect("/productivity/index")
    }
}));
app.post("/productivity/register",WrapAsync(async(req,res)=>{
const {username,password} = req.body;
const checkUser = await userSchema.find({username:username});
if(checkUser != ""){
    res.status(409).send({message:"Not Authenticated"});
}else{
const User = await new userSchema({ username:username});
const newUser = await userSchema.register(User,password);
req.login(newUser,function(err){
if(err) return err 
else{
  return res.send(req.user.session)
}
});
}
}));


app.get("/logout",(req,res,next)=>{
req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/productivity/login');
        });
    
});
app.get("/productivity/account",JoiError,pageTracker, WrapAsync(async (req,res)=>{
    let darkMode = req.session.darkMode;
        let data = req.user;
        res.render("./account",{data,darkMode})
}));

app.put("/productivity/account/change",WrapAsync(async(req,res,next)=>{
    if(req.body.password !== req.body.changedPassword){
    let found = req.user._id;
    let data = await userSchema.findById(found);
    await  data.changePassword(req.body.password,req.body.changedPassword,function(err,result){
        if(err){
            next(err)
        }else{
            res.redirect("/productivity/index")
        }
    })
}else{
    res.redirect("/productivity/Account")
}
    
}));
app.delete("/productivity/account/delete",WrapAsync(async(req,res)=>{
    let data = req.user;
    await data.logout;
    let found = await userSchema.findByIdAndDelete(req.user._id);
    let deleteToDoes = await toDoes.deleteMany({author:req.user._id})
    res.redirect("/productivity/start")
}))

app.post("/productivity/darkMode",(req,res)=>{
    req.session.darkMode = 1;
    res.redirect(req.session.returnTo)
})
app.post("/productivity/lightMode",(req,res)=>{
    req.session.darkMode = 0;
    res.redirect(req.session.returnTo)
});
app.all('*', (req, res, next) => {
    const newError = new ExpressError("Page not Found",404)
    next(newError)
})
app.use((err, req, res, next) => {
    if(!req.user) return res.redirect("/productivity/start")
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('./error', { err })

})

app.listen(3000,()=>{
    console.log("Hello World")
})