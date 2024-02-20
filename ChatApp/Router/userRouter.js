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
// Save user chats
Router.route("/save-chat").post(controller.saveChats);
// Delete user chats
Router.route("/delete-chat").post(controller.deleteChat)
// User search by name
Router.route("/search").post(authVerify, controller.getUserByName);
// user profile photo show
Router.route("/image/:id").get(controller.userProfilePhoto);
// Create Group
Router.route("/create-group").post(authVerify, handleFiles, controller.createGroup);
//Get Users
Router.route("/get-members").post(authVerify, controller.getMembers);
//Get Not Members in group
Router.route("/get/not-members-in-group").post(authVerify, controller.get_Not_Members_In_Group)
// Add member in group
Router.route("/add-members").post(authVerify, controller.addMembers);
// Remove Group Member
Router.route("/remove-member").post(authVerify, controller.removeGroupMember);
// Save group chats
Router.route("/save-group-chat").post(authVerify, controller.saveGroupChat)
// Group old chats
Router.route("/group-old-chats").post(authVerify, controller.oldGroupChats);

module.exports = Router;