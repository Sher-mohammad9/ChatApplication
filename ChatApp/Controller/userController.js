const chatModel = require("../Models/chatModel");
const groupModel = require("../Models/groupModel");
const userModel = require("../Models/userModel");
const memberModel = require("../Models/membersModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.sginUp = async (req, resp) => {
  try {
    const user = JSON.parse(JSON.stringify(req.body));
    let newUser = null;
    if (req?.file?.filename) {
      user.profileImage = "/images/" + req.file.filename;
      newUser = await userModel.create(user);
    } else {
      newUser = await userModel.create(user);
    }
    const users = await userModel.find({ _id: { $ne: newUser._id } });
    const token = jwt.sign({ user }, "1w2e32eq3");
    resp.cookie("token", token).render("home", { user: newUser, users });
  } catch (err) {
    resp.send(err.message);
  }
};
`   `
exports.logIn = async (req, resp, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user && password === user.password) {
      const users = await userModel.find({ _id: { $ne: user._id } });
      const token = jwt.sign({ user }, "1w2e32eq3");
      resp.cookie("token", token).render("home", { user, users });
    } else {
      resp.render("login");
    }
  } catch (err) {
    resp.send(err.message);
  }
};

exports.saveChats = async (req, resp)=>{
  try{
     const newChat = await chatModel.create(req.body);
     resp.status(201).send({saveChats : newChat})
  }catch(err){
    resp.status(400).json({msg : err.message});
  }
}

exports.userChats = async (data) => {
  try {
    const chatWithUser = await userModel.findById(data.receiver_id);
    const userChats = await chatModel.find({
      $or: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ],
    });
    return {userChats, chatWithUser}
  } catch (err) {
    console.log(err.message);
  }
};

exports.getUserByName = async (req, resp) => {
  try {
    const userName = req.body;
    const searchUser = await userModel.find({$and : [{name : { $regex: userName.userName, $options: "i" }}, {_id : {$ne : req.user._id}}]
    });
    resp.render("home", {
      user: req.user,
      users: searchUser,
      value: userName.userName,
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.userProfilePhoto = async (req, resp) => {
  try {
    const userPhoto = await userModel.findById(req.params.id);
    resp.render("profileShow", { imageUrl: userPhoto.profileImage });
  } catch (err) {
    console.log(err.message);
  }
};

exports.deleteChat = async (req, resp)=>{
  try {
    const userChats = await chatModel.deleteOne({_id : req.body.chatId})
    resp.status(200).send({success : true})
  } catch (err) {
    console.log(err.message);
  }
}

// Create Group and group card oprations

exports.createGroup = async (req, resp)=>{
  try{
    const groupData = {
      creator_id : req.user._id,
      name : req.body.name,
      profileImage : req.body.profileImage,
      limit : req.body.limit
    }
     await groupModel.create(groupData)
     const group = await groupModel.find({creator_id : req.user._id});

    //  resp.render("home", {user : req.user, users : req.users, groups : group})
    resp.redirect("/chat/app");
  }catch(err){
    resp.send(err.message)
  }
};

// group data
exports.groupData = async (req)=>{
  try{
    const data = await groupModel.findOne({creator_id : req.sender_id, _id : req.groupId})
    return data;
  }catch(err){
    return {msg : err.message}
  }
}

// Get group Members
exports.getMembers = async (req, resp)=>{
  try{
     const groupMembers = await userModel.aggregate([
      {
          $lookup : {
            from : "membergroups",
            localField : "_id",
            foreignField : "user_id",
            pipeline : [
              {
                $match : {
                  $expr : {
                    $and : [
                      {$eq : ["$group_id", new mongoose.Types.ObjectId(req.body._id)]}
                    ]
                  }
                }
              }
            ],
            as : "members"
          }
      },

      {
        $match : {
            _id : {$ne : new mongoose.Types.ObjectId(req.user._id)}
        }
      }
     ])

     const members = [];
     for(let i=0; i < groupMembers.length; i++){
         if(groupMembers[i].members.length > 0){
          members.push(groupMembers[i])
         }
     }
     resp.status(200).send({members,});
  }catch(err){
    console.log(err.message);
    resp.status(500).send({msg:err.message});
  }
}

// get_Not_Members_In_Group
exports.get_Not_Members_In_Group = async (req, resp)=>{
  try{
    const notGroupMembers = await userModel.aggregate([
      {
          $lookup : {
            from : "membergroups",
            localField : "_id",
            foreignField : "user_id",
            pipeline : [
              {
                $match : {
                  $expr : {
                    $and : [
                      {$eq : ["$group_id", new mongoose.Types.ObjectId(req.body._id)]}
                    ]
                  }
                }
              }
            ],
            as : "members"
          }
      },

      {
        $match : {
            _id : {$ne : new mongoose.Types.ObjectId(req.user._id)}
        }
      }
     ])
  const members = [];
  for(let i=0; i < notGroupMembers.length; i++){
      if(notGroupMembers[i].members.length == 0){
       members.push(notGroupMembers[i])
      }
  }
  
    // const useeee = await userModel.find({$and : [{_id :  {$nin : notMemberId}}, {_id : {$ne :req.user._id }}]})
    resp.status(200).send({members,});
  }catch(err){
    resp.status(500).send({msg : err.message})
  }
};

// Add Members in Group
exports.addMembers = async (req)=>{
  try{
    let groupMembers = []
    for(let i=0; i < req.groupMem.length; i++){
      groupMembers.push({
        group_id : req.group_id,
        user_id : req.groupMem[i]
       })
    }
     const addedMembers = await memberModel.create(groupMembers);
    return addedMembers;
  }catch(err){
    return {msg : err.message};
  }
}
