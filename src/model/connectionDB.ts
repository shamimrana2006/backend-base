import mongoose from "mongoose";
import { DB_URL } from "../config/secrete";

export const connectionDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("db connected");
  } catch (error) {
    console.log("db not connected");
    console.log(error);
  }
};
