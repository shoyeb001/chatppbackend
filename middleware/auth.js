import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

const verifyUser = (req,res,next)=>{
    const acc_token = req.headers.authorization;
    if(acc_token){
        const token = acc_token.split(" ")[1];
        // console.log(token);
        jwt.verify(token, JWT_SECRET, function(err,user) {
            if (err) {
                return res.json({msg:"Token is invalid"});
            }
            req.user = user;
            next();
        });
    }else{
        return res.json({msg:"User unauthorized"});
    }

}

export default verifyUser;
