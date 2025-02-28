import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT||5000;
export const JWT_SECRET = process.env.JWT_SECRET||'thisissecretkey';
