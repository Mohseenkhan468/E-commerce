import { Router } from "express";
import { addAddress, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/user";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const userRouter = Router();

userRouter.post("/add_address", authMiddleware, addAddress);
userRouter.delete("/delete_address/:id", authMiddleware, deleteAddress);
userRouter.get("/list_addresses", authMiddleware, listAddress);
userRouter.put("/",authMiddleware,updateUser)

userRouter.get('/list_users',authMiddleware,adminMiddleware,listUsers)
userRouter.get('/:id',authMiddleware,adminMiddleware,getUserById)

export default userRouter;
