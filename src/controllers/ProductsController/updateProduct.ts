import { Request, Response } from "express";
import { ProductModel } from "../../model/proudct";
import { error_response, success_response } from "../../services/Response";

export const updateProducts = async (req: Request, res: Response) => {
  try {
    const {
      productName = "",
      description = "",
      price = null,
      stock = null,
      brand = "",
      imageURL = "",
      category = "",

      _id,
    } = req.body;

    const updatedFields: any = {};

    if (productName) updatedFields.productName = productName;
    if (description) updatedFields.description = description;
    if (price !== null) updatedFields.price = price;
    if (stock !== null) updatedFields.stock = stock;
    if (brand) updatedFields.brand = brand;
    if (imageURL) updatedFields.imageURL = imageURL;
    if (category) updatedFields.category = category;

    const response: any = await ProductModel.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: updatedFields,
      },
      { new: true }
    );

    return success_response(res, {
      message: "update success",
      payload: response,
    });
  } catch (error: any) {
    return error_response(res, { message: error.message });
  }
};
