import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
    img:{
        type:String,
        required:true,
        default:"https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
    }
},{timestamps:true});

export default mongoose.model("User",UserSchema);