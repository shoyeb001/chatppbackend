import UserSchema from "../../models/UserModel"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import path from "path";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const image = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, image);
    },
});

const handelMultipartData = multer({
    storage,
    limits: { fileSize: 100000000 * 5 },
}).single("photo");


const RegisterController = {
    async register(req,res){
        handelMultipartData(req,res, async(error)=>{
            if (error) {
                console.log(error);
            }
            if (!req.file) {
                return res.status(501).json({msg:"Photo is required"});
            }
            const photo = req.file.path;
            const {name,username,password,confirmPassword} = req.body;
            if(!name||!username||!password){
                return res.status(203).json({msg:"Enter credentials"});
            }
    
            if(password!=confirmPassword){
                return res.status(201).json({msg:"Password & confirm password not matched"});
            }
    
            const checkUser = await UserSchema.findOne({username:username})
            if(checkUser){
                return res.status(202).json({msg:"User Already exists"});
            }
    
            const salt = bcrypt.genSaltSync(10);
            const hashpassword = bcrypt.hashSync(password, salt);
     
            try {
             const data = new UserSchema({
                 name,
                 username,
                 password: hashpassword,
                 img:photo
             });
     
             const savedata = await data.save();
    
             if (!savedata) {
                 return res.status(501).json({msg:"User not created"});
             }
             var token = jwt.sign({ 
                id:savedata._id,
            }, JWT_SECRET);
    
            res.status(200).json({access_token:token});
            } catch (error) {
                console.log(error);
            }
        });

      
    }
}

export default RegisterController;