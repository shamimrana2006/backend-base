import { Request, Response } from "express";
import { body } from "express-validator";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { error_response, success_response } from "../../services/Response";
import { userType } from "../../model/userModels";
import { ProductModel } from "../../model/proudct";

export const demoProductsAdding = async (req: Request, res: Response) => {
  try {
    await ProductModel.insertMany([
      {
        productName: "Wireless Bluetooth Headphones",
        brand: "Sony",
        price: 120,
        stock: 25,
        category: "Electronics",
        description:
          "Noise-cancelling over-ear headphones with 30-hour battery life.",
        imageURL:
          "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
        sellerId: null,
      },
      {
        productName: "Smart LED TV 43 Inch",
        brand: "Samsung",
        price: 480,
        stock: 10,
        category: "Electronics",
        description: "Full HD Smart TV with built-in Wi-Fi and HDMI ports.",
        imageURL:
          "https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg",
        sellerId: null,
      },
      {
        productName: "Men’s Casual Sneakers",
        brand: "Nike",
        price: 75,
        stock: 50,
        category: "Fashion",
        description: "Lightweight and comfortable sneakers for everyday wear.",
        imageURL:
          "https://m.media-amazon.com/images/I/71w6XqLCRoL._AC_UY695_.jpg",
        sellerId: null,
      },
      {
        productName: "Women’s Leather Handbag",
        brand: "Gucci",
        price: 260,
        stock: 15,
        category: "Fashion",
        description:
          "Genuine leather handbag with adjustable strap and metal logo.",
        imageURL:
          "https://m.media-amazon.com/images/I/61bZ5ZlYpOL._AC_UL1500_.jpg",
        sellerId: null,
      },
      {
        productName: "Gaming Mouse RGB",
        brand: "Logitech",
        price: 45,
        stock: 60,
        category: "Accessories",
        description:
          "High precision gaming mouse with customizable RGB lighting.",
        imageURL:
          "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg",
        sellerId: null,
      },
      {
        productName: "Wooden Study Table",
        brand: "IKEA",
        price: 150,
        stock: 8,
        category: "Furniture",
        description:
          "Durable and stylish wooden study table for home and office use.",
        imageURL:
          "https://m.media-amazon.com/images/I/71MVo4tUZzL._AC_SL1500_.jpg",
        sellerId: null,
      },
    ]);

    return success_response(res, {
      message: ` products demo adding successful`,
    });
  } catch (error: any) {
    return error_response(res, { message: error.message });
  }
};
