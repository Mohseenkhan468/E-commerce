import { Router } from "express";
import { login, me, signUp } from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
// import { ErrorHandler } from "../../error_handler";
const authRoutes:Router=Router()

authRoutes.post('/signup',signUp)
authRoutes.post('/login',login)
authRoutes.get('/me',authMiddleware,me)

export default authRoutes