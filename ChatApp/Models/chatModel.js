const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

    receiver_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

    message : {
        type : String,
        required : true
    }
}, 
{timestamps : true}
) 

module.exports = new mongoose.model("chats", chatSchema);