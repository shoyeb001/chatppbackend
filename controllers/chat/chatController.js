import ChatSchema from "../../models/ChatModel";
import UserSchema from "../../models/UserModel";
import MessageSchema from "../../models/MessageModel";
import { Error } from "mongoose";

const chatController = {
  async getOrCreateChat(req, res, next) {
    const { userId } = req.body
    let isChat = await ChatSchema.find({
      isGroupChat: false,
      users: {
        $all: [req.user.id, userId]
      }
    }).populate("users", "-password").populate("latestMessage");

    isChat = await UserSchema.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      };

      try {
        const createdChat = await ChatSchema.create(chatData);
        const FullChat = await ChatSchema.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400).json({ msg: "Error" });
      }
    }
  },


  async fetchChats(req, res) {
    try {
      let chats = await ChatSchema.find({ users: req.user.id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      chats = await UserSchema.populate(chats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).json(chats);

    } catch (error) {
      console.log(error);
    }
  },

  async createGroupChat(req, res, next) {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ msg: "Please fill the fields" });
    }
    const users = req.body.users;

    if (users.length < 2) {
      return res.statu(400).json({ msg: "More than 2 users are required" });

    }
    users.push(req.user.id); //pushing the loggedin user

    try {
      const groupChat = await ChatSchema.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user.id
      })
      const fullGroupChat = await ChatSchema.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return res.status(200).json(fullGroupChat);
    } catch (error) {
      next(error);
    }
  },

  async renameGroup(req, res, next) {
    try {
      const { chatId, chatName } = req.body;
      const updatedChat = await ChatSchema.findByIdAndUpdate(
        chatId,
        {
          chatName: chatName
        },
        {
          new: true
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (!updatedChat) {
        return res.statu(400).json({ msg: "Chat not found" })
      }
      return res.status(200).json(updatedChat);

    } catch (error) {
      next(error);
    }
  },

  async removeFromGroup(req, res, next) {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(400).json({ msg: "Chat not found" });
    }
    return res.status(200).json({ msg: "User removed successfully" });
  },

  async addToGroup(req, res, next) {
    const { chatId, userId } = req.body;

    const user = req.user.id;
    try {
      const chat = await ChatSchema.findOne({ _id, chatId });
      if (chat.groupAdmin != user) {
        return res.status(400).json({ msg: "You have not permission" });
      }

      const added = await ChatSchema.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!added) {
        return res.status(400).json({ msg: "Chat not found" });
      }

      return res.status(200).json({ msg: "User added successfully" });
    } catch (error) {
      next(error);
    }

  }
}

export default chatController;