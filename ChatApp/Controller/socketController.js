const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");
const { userChats, deleteChat, groupData, addMembers } = require("./userController");

const server = require("../app");

const { Server } = require("socket.io");
const membersModel = require("../Models/membersModel");

const io = new Server(server);

// Create name-space
const myIo = io.of("/my-chat");

myIo.on("connection", async (socket) => {
  console.log(socket.handshake.auth.userId);
  const userId = socket.handshake.auth.userId;

  // Update user status
  await userModel.findByIdAndUpdate(
    { _id: userId },
    { $set: { userStatus: "Online" } },
    { new: true }
  );

  //Broadcast user status online
  socket.broadcast.emit("userOnlineStatus", { userId });

  // User disconnect handle
  socket.on("disconnect", async () => {
    console.log("Disconnect");
    // Update user status
    await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { userStatus: "Offline" } }
    );
    // Broadcast user status Offline
    socket.broadcast.emit("userOfflineStatus", { userId });
  });

  // Handle user message
  socket.on("user-message", async (data) => {
    // Broadcast user message
    socket.broadcast.emit("load-user-message", data);
  });

  // Get old chats
  socket.on("existsChats", async function(data){
    const oldChats = await userChats(data);
    //Broadcast old chats
    socket.emit("loadExistsChats", {oldChats,})
  });

  // Delete chat in database
  socket.on("deleteChat",  function(id){
    socket.broadcast.emit('deleteChatRemove', id)
  })

  // Group chats implement

  socket.on("groupOldChats", async function(data){
    const getGroupOldChats = await groupData(data);
    if(getGroupOldChats[0]){
      // load group old chats
      socket.emit("loadGroupOldChats", getGroupOldChats[0]);
    }else{
      // load group old chats
      socket.emit("loadGroupOldChats", getGroupOldChats[1]);
    }
  });

  socket.on("new-message-in-group", function(chats){
    // emit group new chat
    socket.broadcast.emit("load-new-message-in-group", chats)
  })

  // Add Members
  socket.on("addMembers", async function(memberData){
    const addedMembers = await addMembers(memberData);
    socket.emit("addedMembers", addedMembers)
  })

})

module.exports = server;
