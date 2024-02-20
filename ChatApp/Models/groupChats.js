const mongoose = require("mongoose");

const groupChatSchema = new mongoose.Schema({
    sender_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },

   group_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "groups"
    },

    userName : {
        type : String,
        required : true
    },

    message : {
        type : String,
        required : true
    }
}, 
{timestamps : true}
) 

module.exports = new mongoose.model("groupChats", groupChatSchema);