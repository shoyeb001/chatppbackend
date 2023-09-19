import express from "express";
const routes = express.Router();
import RegisterController from "../controllers/auth/RegisterController";
import LoginController from "../controllers/auth/LoginController";
import verifyUser from "../middleware/auth";
import SearchController from "../controllers/user/SearchController";
import chatController from "../controllers/chat/chatController";
import UserController from "../controllers/user/UserController";
import MessageController from "../controllers/message/MessageController";



routes.get("/api", verifyUser, (req, res) => {
    res.json({
        msg: "This is chat api",
        author: "Sk Shoyeb",
        lisence: "MIT"
    })
});

routes.post("/api/register", RegisterController.register);
routes.post("/api/login",LoginController.login);
routes.get("/api/user/view",verifyUser, UserController.viewUser);
routes.get("/api/user/search",verifyUser, SearchController.searchUser);
routes.post("/api/chat/get",verifyUser,chatController.getOrCreateChat);
routes.get("/api/chat/fetch",verifyUser, chatController.fetchChats);
routes.post("/api/groupchat/create",verifyUser, chatController.createGroupChat);
routes.put("/api/groupchat/rename",verifyUser,chatController.renameGroup);
routes.put("/api/groupchat/add", verifyUser, chatController.addToGroup);
routes.post("/api/message/send",verifyUser, MessageController.sendMessage);
routes.get("/api/message/fetch/:chatId", verifyUser, MessageController.fetchAllMessage);





export default routes;