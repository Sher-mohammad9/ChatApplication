const express = require("express");
const controller = require("../Controller/userController.js");
const {handleFiles} = require("../Middleware/handleFiles.js")
const {authVerify} = require("../Middleware/authVerify.js");
const Router = express.Router();

// Register User
Router.route("/register").post(handleFiles, controller.sginUp);
// Login User
Router.route("/login").post(controller.logIn);
// User Chats Load
Router.route("/chats/:id").get(authVerify, controller.userChats);
// User search y name
Router.route("/search").post(authVerify, controller.getUserByName);
// user f=profile photo show
Router.route("/image/:id").get(controller.userProfilePhoto)

module.exports = Router;