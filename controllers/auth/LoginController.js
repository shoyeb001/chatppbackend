import UserSchema from "../../models/UserModel"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const LoginController = {
    async login(req,res){
        try {
            const isExit = await UserSchema.findOne({username:req.body.username});
            if (!isExit) {
               return res.status(401).json({msg:"User is not authorized1"});
            }
             
            const validatePass = bcrypt.compareSync(req.body.password, isExit.password);
            
            if(!validatePass){
                return res.status(401).json({msg:"user is not authorized3"});
            }

            var token = jwt.sign({ 
                id:isExit._id,
            }, JWT_SECRET);


            res.status(200).json({access_token:token});
            
        } catch (error) {
            next(error);
        }
    }
}

export default LoginController;