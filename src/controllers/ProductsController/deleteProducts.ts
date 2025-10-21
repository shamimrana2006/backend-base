import { Request, Response } from "express";
import { ProductModel } from "../../model/proudct";
import { error_response, success_response } from "../../services/Response";

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;

    const response: any = await ProductModel.findOneAndDelete({
      _id,
    });

    return success_response(res, {
      message: "Delete success",
      payload: response,
    });
  } catch (error: any) {
    return error_response(res, { message: error.message });
  }
};
