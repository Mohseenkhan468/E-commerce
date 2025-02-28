import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/order.controller";
const orderRouter=Router()

orderRouter.post('/',authMiddleware,createOrder)
orderRouter.get('/',authMiddleware,listOrders)
orderRouter.get('/:id',authMiddleware,getOrderById)
orderRouter.post('/cancel_order/:id',authMiddleware,cancelOrder)

export default orderRouter