import { NextFunction, Request, Response } from "express";
import { error_response, success_response } from "../services/Response";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return error_response(res, { message: "not logged in" });
  }
  next();
};
