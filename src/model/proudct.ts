import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  imageURL?: string;
  sellerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    brand: { type: String },
    imageURL: {
      type: String,
      default: "https://motobros.com/wp-content/uploads/2024/09/no-image.jpeg",
    },
    sellerId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);
