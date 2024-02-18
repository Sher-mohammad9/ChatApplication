const {mongoose, Schema, mongo} = require("mongoose");

const memberSchema = new Schema({
    group_id : {
        type : mongoose.Schema.Types.ObjectId,
         ref : "groups"
    },

    user_id : {
       type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }
}, {timestamps : true});

module.exports = new mongoose.model("memberGroup", memberSchema);