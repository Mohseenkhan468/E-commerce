import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { loginValidation, signupValidation } from "../schemas/user";
export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = await signupValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details[0].message,
      });
    }
    const { email, name, password } = req.body;
    // Check if the user already exists
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      throw new BadRequestsException(
        "User already exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
      // return res.status(409).json({
      //   success: false,
      //   message: "User already exists.",
      // });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await prismaClient.user.create({
      data: {
        email,
        name: name || "", // Ensure it's not null
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error("Signup Error:", err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
    });
  }
};
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = await loginValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "This email is not registered.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
    const payload = { id: user.id, role:user.role};
    const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
    return res.status(201).json({
      success: true,
      message: "Login successfully.",
      data: { id: user.id, email: user.email },
      token,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const me = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};
