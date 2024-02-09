const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

exports.sginUp = async (req, resp)=>{
  try{
  const user = JSON.parse(JSON.stringify(req.body));
  let newUser = null
  if(req?.file?.filename){
    user.profileImage = "/images/"+req.file.filename
    newUser = await userModel.create(user);
  }else{
    newUser = await userModel.create(user);
  }
  const users = await userModel.find({_id : {$ne : newUser._id}})
  const token = jwt.sign({user}, "1w2e32eq3");
  resp.cookie("token", token).render("home", {user : newUser, users,})
}catch(err){
  resp.send(err.message)
}
}

exports.logIn = async(req, resp, next)=>{
  try{
  const {email, password} = req.body
  const user = await userModel.findOne({email});
  if(user && password === user.password){
    const users = await userModel.find({_id : {$ne : user._id}})
    const token = jwt.sign({user}, "1w2e32eq3");
    resp.cookie("token", token).render("home", {user, users,})
  }else{
    resp.render("login")
  }
}catch(err){
  resp.send(err.message)
}
}

exports.userChats = async (req, resp)=>{
  try{
    const chatWithUser = await userModel.findById(req.params.id);
    const userChats = await chatModel.find({$or : [ {sender_id : req.user._id, receiver_id : req.params.id }, 
                                                    {sender_id :req.params.id, receiver_id : req.user._id }]});
    resp.render("home", {user : req.user, users : req.users, chatWithUser, userChats,});
  }catch(err){
    console.log(err.message)
  }
}

exports.getUserByName = async (req,resp)=>{
  try{
      const userName = JSON.parse(JSON.stringify(req.body));
      const searchUser = await userModel.find({name : {$regex : userName.userName, $options : "i"}});
      resp.render("home", {user : req.user, users : searchUser, value : userName.userName});
  }catch(err){
    console.log(err.message)
  }
}

exports.userProfilePhoto = async (req, resp)=>{
  try{
    const userPhoto = await userModel.findById(req.params.id);
    resp.render("profileShow", {imageUrl : userPhoto.profileImage});
  }catch(err){
    console.log(err.message);
  }
}