import express, { NextFunction, Request, Response } from "express";
import {
  addProduct,
  productAddValidation,
} from "../../controllers/ProductsController/addProducts";
import { demoProductsAdding } from "../../controllers/ProductsController/demuProducts";
import { isLoggedIn } from "../../middlewares/isLoggedin";
import { updateProducts } from "../../controllers/ProductsController/updateProduct";
import { body } from "express-validator";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { error_response } from "../../services/Response";
import { ProductModel } from "../../model/proudct";
import { isAdmin } from "../../middlewares/isAdmin";
import { deleteProduct } from "../../controllers/ProductsController/deleteProducts";
export const productsRouter = express.Router();

productsRouter.post("/add", isLoggedIn, productAddValidation, addProduct);
productsRouter.post(
  "/updateProductsWithUser",
  isLoggedIn,
  [body("_id").notEmpty().withMessage("_id required")],
  async (req: Request, res: Response, next: NextFunction) => {
    const errorMessge = await errorMessageGet(req);
    if (errorMessge) {
      return error_response(res, { message: errorMessge });
    }
    const { _id = null } = req.body;
    const { _id: Id = null } = req.user as any;

    const product = await ProductModel.findOne({ _id, sellerId: Id });
    if (!product) {
      return error_response(res, { message: "product not found for you" });
    }
    next();
  },
  updateProducts
);
productsRouter.delete(
  "/DelateProductsWithUser",
  isLoggedIn,
  [body("_id").notEmpty().withMessage("_id required")],
  async (req: Request, res: Response, next: NextFunction) => {
    const errorMessge = await errorMessageGet(req);
    if (errorMessge) {
      return error_response(res, { message: errorMessge });
    }
    const { _id = null } = req.body;
    const { _id: Id = null } = req.user as any;

    const product = await ProductModel.findOne({ _id, sellerId: Id });
    if (!product) {
      return error_response(res, { message: "product not found for you" });
    }
    next();
  },
  deleteProduct
);
productsRouter.post(
  "/updateProductsWithAdmin",
  isAdmin,
  [body("_id").notEmpty().withMessage("_id required")],
  async (req: Request, res: Response, next: NextFunction) => {
    const errorMessge = await errorMessageGet(req);
    if (errorMessge) {
      return error_response(res, { message: errorMessge });
    }
    const { _id = null } = req.body;

    const product = await ProductModel.findOne({ _id });
    if (!product) {
      return error_response(res, { message: "product not found" });
    }
    next();
  },
  updateProducts
);
productsRouter.delete(
  "/deleteProductsWithAdmin",
  isAdmin,
  [body("_id").notEmpty().withMessage("_id required")],
  async (req: Request, res: Response, next: NextFunction) => {
    const errorMessge = await errorMessageGet(req);
    if (errorMessge) {
      return error_response(res, { message: errorMessge });
    }
    const { _id = null } = req.body;

    const product = await ProductModel.findOne({ _id });
    if (!product) {
      return error_response(res, { message: "product not found" });
    }
    next();
  },
  deleteProduct
);
productsRouter.get("/demoProducts", demoProductsAdding);
