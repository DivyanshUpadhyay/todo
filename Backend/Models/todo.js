const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        minlength : 10,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    user : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
})
const Todo = mongoose.model('Todo',todoSchema);
module.exports = Todo;