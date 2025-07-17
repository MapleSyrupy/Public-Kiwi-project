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
const { pageTracker } = require("./middleware.js")
const dated = require("date-and-time")
const toDo = require("./routers/toDo.js");
const cors = require("cors");
const todoSchema = require("./Models/todoSchema.js");
const studyTimerSchema = require("./Models/studyTimerSchema.js")
const dateTime = require("date-and-time")
require("dotenv").config()
const openAI = require("openai")
const openai = new openAI({ apiKey: process.env.OPENAI_API_KEY })

app.set("view engine", "ejs");
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("views", path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "secret",
    sameSite: "none",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(({
        mongoUrl: 'mongodb://127.0.0.1:27017/ToDoList'
    }))
}));

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5173/index/podqopdqkp"],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());
app.use(passport.authenticate("session"))

app.use("/productivity/index", indexes);
app.use("/productivity/login", loginout);
app.use("/productivity/new", news);
app.use("/productivity/toDo", toDo)
app.get("/productivity/start", (req, res) => {
    res.render("./starting/start")
})

app.get("/productivity/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ user: req.user._id });
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
})
app.get("/productivity/user/data", async (req, res) => {
    if (req.isAuthenticated()) {
        const found = await userSchema.findById(req.user._id)
        res.send(found)
    } else {
        res.status(401).send({ message: "Not authenticated" })
    }
})
app.get("/productivity/ai", async (req, res) => {

    async function main() {

    }
})
app.get("/productivity/toDoes/:categories", async (req, res) => {
    let parameters = req.params
    if (req.isAuthenticated()) {
        let user = req.user;
        const found = await todoSchema.find({ author: user._id, categories: parameters.categories });
        const found2 = await userSchema.findOne({ _id: user._id })
        const newDate = new Date()
        const formattedDate = dated.format(newDate, "YYYY/MM/DD HH:mm");
        for (let dates of found) {
            if (dates.time !== "" || dates.date !== "") {
                const newDate2 = dates.date.replaceAll("-", "/")
                const formattedDate2 = dated.parse(`${newDate2} ${dates.time}`, "YYYY/MM/DD HH:mm")
                const finalFormat = dated.format(formattedDate2, "YYYY/MM/DD HH:mm");
                if (finalFormat <= formattedDate) {
                    await todoSchema.findByIdAndUpdate({ _id: dates._id }, { isLate: true })
                } else {
                    await todoSchema.findByIdAndUpdate({ _id: dates._id }, { isLate: false })
                }
            }
        }
        res.send({ found, found2 })
    }
})
app.get("/productivity/toDoes/", async (req, res) => {
    let parameters = req.params
    if (req.isAuthenticated()) {
        let user = req.user;
        const found = await todoSchema.find({ author: user._id,checked :false });
        const found2 = await userSchema.findOne({ _id: user._id });
        const found3 = await studyTimerSchema.find({ author: user._id }).populate("affectedTodoes")
        res.send({ found, found2, found3 })
    }
})
app.get("/productivity/studyTimers", async (req, res) => {
    if (req.isAuthenticated()) {
        const found3 = await studyTimerSchema.find({ author: req.user._id, active: true })
        const found4 =  await studyTimerSchema.find({ author: req.user._id, active: true }).populate("affectedTodoes");
        console.log(found4)
        res.send({found3,found4})
    }
})
app.get("/productivity/register", WrapAsync(async (req, res) => {
    if (!req.user) {
        res.render("./register.ejs")
    } else {
        res.redirect("/productivity/index")
    }
}));
app.post("/productivity/register", WrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const currentDate = dateTime.format(new Date(), "YYYY/MM/DD");
    const checkUser = await userSchema.find({ username: username });
    if (checkUser != "") {
        res.status(409).send({ message: "Not Authenticated" });
    } else {
        const User = await new userSchema({ username: username });
        User.lastActive = currentDate
        const newUser = await userSchema.register(User, password);
        req.login(newUser, function (err) {
            if (err) return err
            else {
                return res.send(req.user._id)
            }
        });
    }
}));
app.post("/timeLogger", async (req, res) => {
    if (req.isAuthenticated()) {
        const currentDate = dateTime.format(new Date(), "YYYY/MM/DD")
        const found = await userSchema.findById(req.user._id);
        if (found.lastActive < currentDate) {
            const found2 = await userSchema.findByIdAndUpdate({ _id: req.user._id }, { lastActive: currentDate, toma: found.toma - 33 });
            console.log(found2)
        }
    }



});

app.post("/productivity/endTimer", async (req, res) => {
    const { unloaded } = req.body;
    const unactive = await studyTimerSchema.findByIdAndUpdate({ _id: unloaded._id }, { active: false })
    for (let checks of unloaded.affectedTodoes) {
        const found = await toDoes.findByIdAndUpdate({ _id: checks._id }, { checked: true })
    }
    const truehp = unloaded.TimerList.time * 1.11
    const healthPoints = (unloaded.TimerList.time * 60000) / req.body.x * 100;
    const foundToma = await userSchema.findById(unloaded.author);
    if (foundToma.toma < 150) {
        if (healthPoints > 80) {
            const found2 = await userSchema.findByIdAndUpdate({ _id: unloaded.author }, { toma: Math.floor(foundToma.toma + (truehp + (truehp * 0.25))) });
        } else if (healthPoints < 80) {
            const found2 = await userSchema.findByIdAndUpdate({ _id: unloaded.author }, { toma: Math.floor(foundToma.toma + truehp) });
        }
    }
})
app.post("/productivity/:id/startTimer", async (req, res) => {
    let data = req.body.time
    let data2 = req.body.check
    let data3 = req.body.id
    let baseValue = 0;
    for (const timers in data) {
        baseValue += data[timers];
        data.time = baseValue
    }
    await studyTimerSchema.findOneAndUpdate({ active: true })
    const newStudyTimer = await new studyTimerSchema({ affectedTodoes: data2.map((x) => x._id) })
    newStudyTimer.TimerList = data
    newStudyTimer.active = true
    newStudyTimer.author = data3

    if (req.body.test === true) {
        let addeddesc = ""
        for (let descriptions of data2) {
            addeddesc = addeddesc + "" + descriptions.description
        }
        const assistant = await openai.beta.assistants.create({
            name: "Test Maker",
            instructions:
                "You are an AI assistant designed to generate multiple-choice tests in JSON format with questions including four answer options A, B, C, D and a correct answer; structure the JSON as {Questions: [{question: <Question text>, options: [A, B, C, D], answer: <Correct option>(put the full correct option here)]}; ensure clarity, subject diversity, difficulty balance, correctness, and randomization of options, providing valid JSON output per user-specified topics. P.S. just return the test, don't have any other text in the response",
            model: "gpt-4o-mini",
        })
        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(

            thread.id,
            {
                role: "user",
                content: `${addeddesc}`
            }

        );
        let run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: assistant.id
            }
        );
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
                newStudyTimer.test = `${message.content[0].text.value}`
            }
        } else {
            console.log(run.status);
        }
    }

    await newStudyTimer.save();
    res.send(newStudyTimer._id)
})
app.post("/kiwisRevenge/test", async (req, res) => {
    const data = req.body.dataes;
    let data2 = ""
    const assistant = await openai.beta.assistants.create({
        name: "Punishment Maker",
        instructions:
            "You are an AI assistant designed to generate multiple-choice tests in JSON format with questions including four answer options A, B, C, D and a correct answer; structure the JSON as {Questions: [{question: <Question text>, options: [A, B, C, D], answer: <Correct option>(put the full correct option here)]}; ensure clarity, subject diversity, difficulty balance, correctness, and randomization of options, providing valid JSON output per user-specified topics. P.S. just return the test, don't have any other text in the response",
        model: "gpt-4o",
    })
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(

        thread.id,
        {
            role: "user",
            content: `${data}`
        }

    );
    let run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: assistant.id
        }
    );
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
            run.thread_id
        );
        for (const message of messages.data.reverse()) {
            console.log(`${message.role} > ${message.content[0].text.value}`);
            data2 = `${message.content[0].text.value}`
        }
        res.send(data2)
    } else {
        console.log(run.status);
    }

})
app.post("/makeCategory/:id", async (req, res) => {
    const check = await userSchema.findById(req.params.id)
    if (check.categories.includes(req.body.data.data) === false) {
        const found = await userSchema.findByIdAndUpdate({ _id: req.params.id }, { $push: { categories: req.body.data.data } })
    } else {
        res.status(400, "Already Exist")
    }
})
app.post("/kiwiForgive",async(req,res)=>{
    const found = await userSchema.findById({_id:req.body._id})
    await userSchema.findByIdAndUpdate({_id:req.body._id},{toma:found.toma+33})
})
app.get("/productivity/:id/test", async (req, res) => {
    if (req.isAuthenticated) {
        const found = await studyTimerSchema.findById(req.params.id);
        res.send(found)
    }
})
app.post("/deleteCategory/:id", async (req, res) => {
    const check = await userSchema.findById(req.params.id)
    if (check.categories.length !== 0) {
        const foundToDoes = await todoSchema.deleteMany({ author: req.params.id, categories: req.body.data.data })
        const found = await userSchema.findByIdAndUpdate({ _id: req.params.id }, { $pull: { categories: req.body.data.data } })
    } else {
        res.status(400, "This is empty")
    }
})
app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/productivity/login');
    });

});
app.get("/productivity/account", JoiError, pageTracker, WrapAsync(async (req, res) => {
    let darkMode = req.session.darkMode;
    let data = req.user;
    res.render("./account", { data, darkMode })
}));

app.put("/productivity/account/change", WrapAsync(async (req, res, next) => {
    if (req.body.password !== req.body.changedPassword) {
        let found = req.user._id;
        let data = await userSchema.findById(found);
        await data.changePassword(req.body.password, req.body.changedPassword, function (err, result) {
            if (err) {
                next(err)
            } else {
                res.redirect("/productivity/index")
            }
        })
    } else {
        res.redirect("/productivity/Account")
    }

}));
app.post("/test", async (req, res) => {
    const healthPoints = req.body.x
    const foundToma = await userSchema.findById(req.body.author);
    if (foundToma.toma < 150) {
        if (healthPoints > 80) {
            const found2 = await userSchema.findByIdAndUpdate({ _id: req.body.author }, { toma: Math.floor(foundToma.toma + 20) });
        } else if (50 < healthPoints < 80) {
            const found2 = await userSchema.findByIdAndUpdate({ _id: req.body.author }, { toma: Math.floor(foundToma.toma + 10) });
        }
       

    }  
     if (healthPoints<50) {
        console.log("yes")
        const found2 = await userSchema.findByIdAndUpdate({ _id: req.body.author }, { toma: Math.floor(foundToma.toma - 15) });
    }
})
app.delete("/productivity/account/delete", WrapAsync(async (req, res) => {
    let data = req.user;
    await data.logout;
    let found = await userSchema.findByIdAndDelete(req.user._id);
    let deleteToDoes = await toDoes.deleteMany({ author: req.user._id })
    res.redirect("/productivity/start")
}))

app.post("/productivity/darkMode", (req, res) => {
    req.session.darkMode = 1;
    res.redirect(req.session.returnTo)
})
app.post("/productivity/lightMode", (req, res) => {
    req.session.darkMode = 0;
    res.redirect(req.session.returnTo)
});
app.all('*', (req, res, next) => {
    const newError = new ExpressError("Page not Found", 404)
    next(newError)
})
app.use((err, req, res, next) => {
    if (!req.user) return res.redirect("/productivity/start")
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('./error', { err })

})

app.listen(3000, () => {
    console.log("Hello World")
})