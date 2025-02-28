import { Request, Response } from "express";
import {
  AddCartItemValidation,
  UpdateCartItemValidation,
} from "../schemas/cart";
import { prismaClient } from "..";

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { error } = await AddCartItemValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user_id = req?.user?.id;
    const { product_id, quantity } = req.body;
    const product = await prismaClient.product.findFirst({
      where: { id: product_id },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    const newItem = await prismaClient.cartItems.create({
      data: {
        user_id: user_id as number,
        product_id: product_id,
        quantity: quantity,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Cart item added successfully.",
      data: newItem,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteItemFromCart = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const item_id = Number(req?.params?.id);
    const user_id = Number(req?.user?.id);
    const item = await prismaClient.cartItems.findFirst({
      where: { id: item_id, user_id },
    });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }
    await prismaClient.cartItems.delete({ where: { id: item.id } });
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user_id = Number(req?.user?.id);
    const item_id = Number(req?.params?.id);
    const { error } = await UpdateCartItemValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const quantity = req.body.quantity;
    const item = await prismaClient.cartItems.findFirst({
      where: { id: item_id, user_id },
    });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }
    const updatedItem = await prismaClient.cartItems.update({
      where: { id: item.id },
      data: { quantity },
    });
    return res.status(201).json({
      success: true,
      message: "Cart item updated successfully.",
      data: updatedItem,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCartItems = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user_id = req?.user?.id;
    const data = await prismaClient.cartItems.findMany({
      where: { user_id },
      include: { product: true },
    });
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
