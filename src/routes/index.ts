import { Router } from "express";
import authRoutes from "./auth";
import productRouter from "./product";
import userRouter from "./user";
import cartRouter from "./cart";
import orderRouter from "./order.route";
const rootRouter:Router=Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products',productRouter)
rootRouter.use('/users',userRouter)
rootRouter.use('/carts',cartRouter)
rootRouter.use('/orders',orderRouter)
export default rootRouter