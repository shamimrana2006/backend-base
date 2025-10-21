import { Response } from "express";

type successTypes = {
  message?: string;
  status?: number;
  payload?: any;
};
type errorTypes = {
  message?: string;
  status?: number;
};

export const success_response = (
  res: Response,
  { message = "success", payload = {}, status = 200 }: successTypes
) => {
  res.status(status).json({
    message,
    payload,
  });
};
export const error_response = (
  res: Response,
  { message = "success", status = 500 }: errorTypes
) => {
  res.status(status).json({
    message,
    status,
  });
};
