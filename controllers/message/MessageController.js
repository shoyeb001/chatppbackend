import MessageSchema from "../../models/MessageModel"
import UserSchema from "../../models/UserModel";
import ChatSchema from "../../models/ChatModel";

const MessageController = {
    async sendMessage(req,res,next){
        const {content, chatId} = req.body;

        if(!content || !chatId){
            return res.status(400).json({msg:"Invalid data passed"});
        }

        const newMessage = {
            sender: req.user.id,
            content,
            chat:chatId
        };

        try {
            let message = await MessageSchema.create(newMessage);
            message = await message.populate("sender", "name img");
            message = await message.populate("chat");
            message = await UserSchema.populate(message,{
                path:"chat.users",
                select:"name pic email"
            });

            await ChatSchema.findByIdAndUpdate(req.body.chatId, {latestMessage:message});

            return res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    },

    async fetchAllMessage(req,res,next){
        try {
            let message = await MessageSchema.find({chat:req.params.chatId}).populate("sender", "name pic email")
            .populate("chat");
            return res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }
}

export default MessageController;