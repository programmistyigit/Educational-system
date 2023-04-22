const { model, Schema } = require("mongoose");

const schemaStudent = new Schema({
    name: String,
    firstName: String,
    telNumber: String,
    password: String,
    course: String,
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbX0lZHrfSwrUBz8gcmZ1mlUEXB8ULTGoJll6sEtiQ4VUiX-LwYUkOl9lv3MqgmRquack&usqp=CAU"
    },
    code: String,
    location: {
        type: Object,
        default: {
            region: "",
            tuman: ""
        },
        required: true
    }
},
    {
        timestamps: true,
    }
)


const schemaMenejer = new Schema({
    name: String,
    firstName: String,
    telNumber: String,
    password: String,
    message:{
        default:[]
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbX0lZHrfSwrUBz8gcmZ1mlUEXB8ULTGoJll6sEtiQ4VUiX-LwYUkOl9lv3MqgmRquack&usqp=CAU"
    },
    confirm: {
        type: Boolean,
        default: false
    },
    courses: Array,
    location: {
        type: Object,
        default: {
            region: "",
            tuman: ""
        },
        required: true
    },
    students: {
        type: Object,
        default: {
            online: [],
            ofline: []
        }
    },
    tichers: [{
        type: Schema.Types.ObjectId,
        ref: "tichers"
    }]
},
    {
        timestamps: true
    }
)


const schemaTicher = new Schema({
    name: String,
    firstName: String,
    telNumber: String,
    password: String,
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbX0lZHrfSwrUBz8gcmZ1mlUEXB8ULTGoJll6sEtiQ4VUiX-LwYUkOl9lv3MqgmRquack&usqp=CAU"
    },
    confirm: {
        type: Boolean,
        default: false
    },
    message:{
        type:Schema.Types.ObjectId,
        default:[],
        ref:"messages"
    },
    location: {
        type: Object,
        default: {
            region: "",
            tuman: ""
        },
        required: true
    },
    jobs: {
        type: Array,
        default: [],
        required: true
    }
}, {
    timestamps: true
}
)

module.exports = [model("reg", schemaStudent), model("fillials", schemaMenejer) , model("ticher" , schemaTicher)]