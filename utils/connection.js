import { DB_URL } from "../config/index";
import mongoose from "mongoose";

const connection = ()=>{
    try {
        mongoose.connect(DB_URL);
        console.log("DB Connected");
    } catch (error) {
        console.log(error);
    }
}

export default connection;