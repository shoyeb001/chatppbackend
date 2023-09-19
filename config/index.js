import dotenv from "dotenv";
dotenv.config();

export const {PORT,DB_URL,JWT_SECRET, FRONTEND_ORIGIN} = process.env;