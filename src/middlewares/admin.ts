import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

declare module "express" {
  export interface Request {
    user?: User;
  }
}
const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user;
    if (user?.role == "ADMIN") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

export default adminMiddleware;
