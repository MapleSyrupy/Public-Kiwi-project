const { date, string, boolean } = require("joi");
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/ToDoList');
const {Schema} = mongoose
const toDo = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
    date:{
        type:String,
        required:false
    },
    time:{
        type:String,
        required:false
    },
    isValid:{
        type:Boolean
    },
    isImportant:{
        type:Boolean
    },
    isLate:{
        type:Boolean,
        default:false
    },
    categories:{
        type:String,
        ref:"User"
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports =  mongoose.model("Remember",toDo)