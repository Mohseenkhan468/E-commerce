import { Request, Response } from "express";
import { prismaClient } from "..";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return await prismaClient.$transaction(async (tx) => {
      const cartItems = await tx.cartItems.findMany({
        where: { user_id: req?.user?.id },
        include: { product: true },
      });
      if (cartItems.length == 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty.",
        });
      }
      const price = cartItems.reduce((prev, current) => {
        return prev + current.quantity * +current.product.price;
      }, 0);
      const address = await tx.address.findFirst({
        where: { id: Number(req?.user?.id) },
      });
      const order = await tx.order.create({
        data: {
          user_id: Number(req?.user?.id),
          net_amount: price,
          address: `${address?.line_one} ${address?.line_two} ${address?.city} ${address?.country}`,
          products: {
            create: cartItems.map((cart) => {
              return { product_id: cart.product_id, quantity: cart.quantity };
            }),
          },
        },
      });
      const orderEvent = await tx.orderEvent.create({
        data: {
          order_id: order.id,
        },
      });
      await tx.cartItems.deleteMany({
        where: { user_id: Number(req?.user?.id) },
      });
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await prismaClient.order.findMany({
      where: { id: req?.user?.id },
    });
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return await prismaClient.$transaction(async (tx) => {
      const order = await prismaClient.order.findFirst({
        where: { id: Number(req?.params?.id), user_id: req?.user?.id },
      });
      if (!order) {
        return res.status(404).json({
          success: true,
          message: "Order not found.",
        });
      }
      if (order.status == "CANCELLED") {
        return res.status(400).json({
          success: false,
          message: "Order already cancelled.",
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      await tx.orderEvent.create({
        data: { order_id: order.id, status: "CANCELLED" },
      });
      return res.status(201).json({
        success: true,
        message: "Order cancelled successfully.",
      });
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: { id: Number(req?.params?.id), user_id: req?.user?.id },
      include: { products: true, events: true },
    });
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
