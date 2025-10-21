import { log } from "console";
import { Request, Response } from "express";
import { success_response } from "../../services/Response";

export const profileController = async (req: Request, res: Response) => {
  return success_response(res, {
    message: "profile success",
    payload: req.user,
  });
};
