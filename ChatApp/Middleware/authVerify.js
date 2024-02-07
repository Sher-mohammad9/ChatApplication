const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel")

exports.authVerify = async(req, resp,next)=>{
    const token = req.cookies["token"]
    if(token){
        const checkAuth = jwt.verify(token, "1w2e32eq3");
        const existsUser = await userModel.findOne({email : checkAuth.user.email});
        req.users = await userModel.find({_id : {$ne :existsUser._id }});
        req.user = existsUser
        if(checkAuth){
            return next()
        }
    }else{
        resp.render("register")
    }
}