import express from "express";
import { productsRouter } from "./routers/productsRouter";
import { UserRouter } from "./routers/userRouter";
import { paymentRouter } from "../config/ssl-commernz/paymentConfige";

export const AllRouter = express.Router();

AllRouter.use(paymentRouter);
AllRouter.use("/product", productsRouter);
AllRouter.use(UserRouter);
