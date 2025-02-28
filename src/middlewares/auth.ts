import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

declare module 'express'{
    export interface Request{
        user?:User
    }
}
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }
    const payload = await jwt.verify(token, JWT_SECRET) as JwtPayload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.id },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }
    req.user=user;
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

export default authMiddleware;
