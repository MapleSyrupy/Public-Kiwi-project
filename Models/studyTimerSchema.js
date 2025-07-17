const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/ToDoList');
const {Schema} = mongoose

const studyTimerSchema = new mongoose.Schema({
    author:{
        type:Schema.Types.ObjectId,
        required:true
    },
    affectedTodoes:{
        type:[Schema.Types.ObjectId],
        ref:"Remember",
        required:true
    },
    TimerList:{
        type:Object,
        required:true
    },
    active:{
        type:Boolean
    },
    test:{
        type:Object
    }
})

module.exports = mongoose.model("StudyTimers",studyTimerSchema)