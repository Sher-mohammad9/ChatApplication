const express = require("express");
const groupModel = require("../Models/groupModel");
const { authVerify } = require("../Middleware/authVerify");
const membersModel = require("../Models/membersModel");
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
      const joiningGroups = await membersModel.find({user_id : req.user._id}).populate("group_id")
      resp.render("home", {user : req.user, users : req.users, groups, joiningGroups});
});

Router.route("/create-group").get((req, resp)=>{
      resp.render("createGroup")
})
module.exports = Router