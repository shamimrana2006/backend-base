import mongoose, { Document, Schema } from "mongoose";

export interface userType extends Document {
  name: string;
  role?: string;
  password: string;
  email: string;
  photoURL?: string;
  createAT?: Date;
  age?: number;
  verified?: boolean;
  OTP?: any;
}

const userSchema = new Schema<userType>({
  name: { type: String, required: true },
  role: { type: String, default: "user" },
  password: { type: String, required: true },
  age: { type: Number },
  verified: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  photoURL: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
  },
  OTP: {
    value: { type: String },
    expireIN: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 60 * 2),
    },
  },
  createAT: {
    type: Date,
    default: Date.now,
  },
});

export const userModel = mongoose.model("user", userSchema);
