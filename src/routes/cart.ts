import { Router } from "express";
import { addItemToCart, deleteItemFromCart, getCartItems, updateCartItem } from "../controllers/cart";
import authMiddleware from "../middlewares/auth";

const cartRouter = Router();

cartRouter.post("/add_item", authMiddleware, addItemToCart);
cartRouter.delete("/:id", authMiddleware, deleteItemFromCart);
cartRouter.put('/:id',authMiddleware,updateCartItem)
cartRouter.get('/list',authMiddleware,getCartItems)
export default cartRouter;
