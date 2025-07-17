const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/ToDoList');
const {Schema} = mongoose
const userSchema = new mongoose.Schema({
    toDos:{
        type:[String],
        ref:"Remember"
    },
    fixedCategories:{
        type:[String],
        default:["General"]
    },
    toma:{
        type:Number,
        default:0
    },
    categories:{
        type:[String]
    },
    lastActive:{
        type:String
    }
})
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User",userSchema)
