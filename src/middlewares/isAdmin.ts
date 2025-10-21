import { NextFunction, Request, Response } from "express";
import { error_response, success_response } from "../services/Response";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return error_response(res, { message: "not logged in" });
  }
  if (!((req as any).user?.role == "admin")) {
    return error_response(res, { message: "access deny" });
  }
  next();
};
