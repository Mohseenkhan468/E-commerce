import { query, Request, Response } from "express";
import { prismaClient } from "..";
import {
  CreateProductValidation,
  UpdateProductValidation,
} from "../schemas/product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { error } = await CreateProductValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { error } = await UpdateProductValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const product = await prismaClient.product.findFirst({
      where: { id: Number(req?.params?.id) },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    const updatededProduct = await prismaClient.product.update({
      where: { id: Number(req?.params?.id) },
      data: req.body,
    });
    return res.status(201).json({
      success: true,
      message: "Product updated successfully.",
      data: updatededProduct,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const product = await prismaClient.product.findFirst({
      where: { id: Number(req?.params?.id) },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    await prismaClient.product.delete({
      where: { id: Number(req?.params?.id) },
    });
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = Number(req?.query?.page) || 1;
    const limit = Number(req?.query?.limit) || 10;
    const products = await prismaClient.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    const count = await prismaClient.product.count();
    return res.status(200).json({
      success: true,
      data: products,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
      limit,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const product = await prismaClient.product.findFirst({
      where: { id: Number(req?.params?.id) },
    });
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
