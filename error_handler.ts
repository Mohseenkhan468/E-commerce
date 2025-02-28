import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./src/exceptions/root";
import { InternalException } from "./src/exceptions/internal_exception";

export const ErrorHandler = (method: Function) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err: any) {
      let exception: HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else {
        exception = new InternalException(
          "Something went wrong",
          err,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      next(exception)
    }
  };
};
