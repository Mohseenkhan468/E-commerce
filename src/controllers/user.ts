import { Request, Response } from "express";
import { addAddressValidation, updateUserValidation } from "../schemas/user";
import { prismaClient } from "..";

export const addAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = await addAddressValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user = req.user;
    console.log(user?.id);
    const newAddress = await prismaClient.address.create({
      data: {
        ...req.body,
        user_id: user?.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: newAddress,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = Number(req?.params?.id);
    const user_id = req?.user?.id;
    const address = await prismaClient.address.findFirst({
      where: {
        id,
        user_id,
      },
    });
    console.log("address", address);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }
    await prismaClient.address.delete({ where: { id: address.id } });
    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listAddress = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user_id = req?.user?.id;
    const addresses = await prismaClient.address.findMany({
      where: { user_id },
    });
    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = await updateUserValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const user_id = req?.user?.id;
    const shipping_address = await prismaClient.address.findFirst({
      where: { id: req?.body?.default_shipping_address, user_id },
    });
    if (!shipping_address) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found.",
      });
    }
    const billing_address = await prismaClient.address.findFirst({
      where: { id: req?.body?.default_billing_address, user_id },
    });
    if (!billing_address) {
      return res.status(404).json({
        success: false,
        message: "Billing address not found.",
      });
    }
    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: { ...req?.body },
    });
    return res.status(201).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = Number(req?.query?.page) || 1;
    const limit = Number(req?.query?.limit) || 10;
    const users = await prismaClient.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const count = await prismaClient.user.count();
    return res.status(200).json({
      success: true,
      total: count,
      pages: Math.ceil(count / limit),
      current_page: page,
      limit,
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await prismaClient.user.findFirst({
      where: { id: Number(req?.params?.id) },
    });
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

export const changeUserRole = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (err: any) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};
