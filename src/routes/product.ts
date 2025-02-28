import { Router } from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productRouter = Router();

productRouter.post(
  "/create_product",
  authMiddleware,
  adminMiddleware,
  createProduct
);
productRouter.post(
  "/update_product/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);
productRouter.delete(
    "/delete_product/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
  );
  productRouter.get(
    "/list_products/",
    authMiddleware,
    adminMiddleware,
    listProducts
  );
  productRouter.get(
    "/get_product/:id",
    authMiddleware,
    adminMiddleware,
    getProductById
  );
export default productRouter;
