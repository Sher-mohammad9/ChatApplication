const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    mobile : {
        type : String,
        required : true,
        unique : true,
        validate : {
            validator : function(mobile){
                return validator.isMobilePhone(mobile, "any", {strictMode : false})
            },
            message : "Invalid Mobile Number"
        }
    },

    email : {
        type : String,
        required : true,
        unique : true,
        validate : [validator.isEmail, "Email Address Invalid"]
    },

    password : {
        type : String,
        required : true
    },

    userStatus : {
        type : String,
        default : "Online"
    },

    userType : {
        type : String,
        default : "User",
        enum : ["User", "subsUser", "Admin"]
    },

    profileImage : String,
}, 
{ timestamps : true}
)

module.exports = new mongoose.model("users", userSchema);