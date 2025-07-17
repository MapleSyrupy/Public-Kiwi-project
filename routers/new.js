const express = require("express");
const router = express.Router();
const JoiError = require("../middleware.js")
const { isLoggedIn } = require("../middleware.js");
const WrapAsync = require("../ErrorHandling/WrapAsync.js");
const toDoes = require("../Models/todoSchema.js");
const userSchema = require("../Models/userSchema.js");

router.route("/:categories")
    .post(JoiError, async (req, res) => {
        if(req.isAuthenticated()){
        try{
        const {data}= req.body
        const param = req.params;
            const todo = await new toDoes(data)
            const foundUser = await userSchema.findById(req.user._id);
            todo.author = foundUser._id;
            todo.isImportant = false;
            todo.categories = param.categories;
            await todo.save()
            res.send(todo)
            
    }catch(e){
        res.status(400).send(e)
    }
}else{
    res.status(401).send("Not authenticated")
}
})
module.exports = router;