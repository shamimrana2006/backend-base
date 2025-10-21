import { Request } from "express";
import { validationResult } from "express-validator";

export const errorMessageGet = async (req: Request) => {
  const result = await validationResult(req);
  if (!result.isEmpty()) {
    return result.array()[0]?.msg;
  }
  {
    return false;
  }
};
