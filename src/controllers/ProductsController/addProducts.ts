import { Request, Response } from "express";
import { body } from "express-validator";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { error_response, success_response } from "../../services/Response";
import { userType } from "../../model/userModels";
import { ProductModel } from "../../model/proudct";

export const productAddValidation = [
  body("productName").notEmpty().withMessage("productName is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("category").notEmpty().withMessage("category is required"),
  body("price").notEmpty().withMessage("price is required"),
  body("stock").notEmpty().withMessage("stock is required"),
];
export const addProduct = async (req: Request, res: Response) => {
  try {
    const errorMessage = await errorMessageGet(req);
    if (errorMessage) {
      return error_response(res, { message: errorMessage, status: 404 });
    }
    // if (req.user) {
    //   const { name , _id } = req.user as userType;
    // }
    const { _id } = (req as any).user;
    const {
      stock,
      price,
      category,
      description,
      productName,
      brand = "",
      imageURL = "",
      sellerId = _id,
    } = req?.body;

    await ProductModel.insertOne({
      stock,
      price,
      category,
      description,
      brand,
      imageURL,
      sellerId,
      productName,
    });

    return success_response(res, {
      message: `${productName} product adding successful`,
    });
  } catch (error: any) {
    return error_response(res, { message: error.message });
  }
};
