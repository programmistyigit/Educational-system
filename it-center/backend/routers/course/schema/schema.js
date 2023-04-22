const { model , Schema } = require("mongoose");

const schema = new Schema({
    name:String,
    video:String,
    description:String,
    images:String,
    duration:String
} , {timestamps:true})

module.exports = model("courses" , schema)