const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");
const server = require("../app");
 
const {Server} = require("socket.io");

const io = new Server(server);

// Create name-space
const myIo =  io.of("/my-chat")


myIo.on("connection", async (socket)=>{
    console.log(socket.handshake.auth.userId);
    const userId = socket.handshake.auth.userId;
    
    // Update user status
    await userModel.findByIdAndUpdate({_id : userId}, {$set : {userStatus : "Online"}}, {new : true})
    
    //Broadcast user status online
    socket.broadcast.emit("userOnlineStatus", {userId,});

    // User disconnect handle
    socket.on("disconnect", async()=>{
        console.log("Disconnect");
        await userModel.findByIdAndUpdate({_id : userId}, {$set : {userStatus : "Offline"}})
        // Broadcast user status Offline
        socket.broadcast.emit("userOfflineStatus", {userId,});
        
    });

    // Handle user message
    socket.on("user-message", async (data)=>{
        // Save user chats
        const chats = await chatModel.create(data)
        // Broadcast user message
        socket.broadcast.emit("load-user-message", chats)
    })
})

module.exports = server;