import express from "express";
import connection from "./utils/connection.js";
import {PORT,FRONTEND_ORIGIN} from "./config/index.js";
import cros from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";




global.appRoot = path.resolve(__dirname);

const app = express();

app.use(cookieParser());
app.use(cros());
app.use(express.urlencoded({ extended: false})); // used for understand img
app.use(express.json());
app.use(routes);
app.use(express.static(__dirname));


const server =  app.listen(PORT, 
    async()=>{
        console.log(`Lesting to port ${PORT}`);
        await connection();
    }
);

const io = require("socket.io")(server,{
    pingTimeout:40000,
    cors:{
        origin: FRONTEND_ORIGIN,
    }
});

io.on("connection", (socket)=>{
    // console.log("Connected to socket1");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connection");
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on('join chat', (room)=>{
        socket.join(room);
        // console.log("user joined"+room);
    })

    socket.on("new message", (newMessageRecieved)=>{
        let chat = newMessageRecieved.chat;
        if(!chat.users) return;
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    })


})