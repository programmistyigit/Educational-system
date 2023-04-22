const { model, Schema } = require("mongoose");


const schema = new Schema({
    name: String,
    firstName: String,
    telNumber: String,
    password: String,
    course:{
        type:Array,
        default:[],
        required:true
    },
    cords: {
        type: Object,
        default: {
            latitude: null,
            longitude: null
        },
        required: true
    },
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


module.exports = {
    online:model("online_Students", schema),
    ofline:model("ofline_Students", schema)
}