const {mongoose, Schema} = require("mongoose");

const groupSchema = new Schema({
    creator_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

    name : {
        type : String,
        required : true
    },

    profileImage : {
        type : String
    },

    profileImage : {
        type : String,
        default : "/images/group.jpg"
    },

    limit : {
        type : Number,
        required : true
    }
}, {timestamps : true});

module.exports = new mongoose.model("groups", groupSchema);