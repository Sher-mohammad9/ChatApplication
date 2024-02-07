const express = require("express");
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
module.exports = Router