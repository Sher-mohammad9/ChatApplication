const express = require("express");
const mongoose = require("mongoose");
const staticRouter = require("./Router/staticRouter");
const userRouter = require("./Router/userRouter");
const {authVerify} = require("./Middleware/authVerify");
const cookieParser = require("cookie-parser")
const http = require("http");
const path = require("path");

// Connect to Database
mongoose.connect("mongodb://127.0.0.1:27017/Chat-App-Data", {useNewUrlParser : true})
.then(()=> console.log("Successfully connected"));

const app = express();

// Create Server
const server = http.createServer(app);

// Decrypt body data
app.use(express.json());
// Decrypt form data
app.use(express.urlencoded({extended : true}));

//Cookie Parser
app.use(cookieParser())

app.use(express.static(path.resolve("./public")))

// Set template Engine
app.set("view engine", "ejs")
// Set template directory
app.set("views", path.resolve("./views"))


// Handle root route
app.get("/chat/app", authVerify, (req, resp)=>{
    resp.render("home", {user : req.user, users : req.users})
});


app.use("/app", staticRouter);
app.use("/user", userRouter);

module.exports = server