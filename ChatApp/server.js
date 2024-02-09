const server = require("./Controller/socketController");

server.listen(4000, "localhost", ()=>{
    console.log("Server Start At Port 4000");
})