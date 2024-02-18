const express = require("express");
const groupModel = require("../Models/groupModel");
const { authVerify } = require("../Middleware/authVerify");
const Router = express.Router();

Router.route("/register-page").get((req, resp, next)=>{
      resp.render("register")
});

Router.route("/login-page").get((req, resp, next)=>{
      resp.render("login.ejs")
});

Router.route("/logout").get((req,resp)=>{
      resp.clearCookie("token").redirect("/chat/app")
})

// Render create groups page
Router.route("/group").get(authVerify, async (req, resp)=>{
      const groups = await groupModel.find({creator_id : req.user._id});
      if(groups.length > 0){
            resp.render("home", {user : req.user, users : req.users, groups,});
            return;  
      }
      resp.render("createGroup")
});

Router.route("/create-group").get((req, resp)=>{
      resp.render("createGroup")
})
module.exports = Router