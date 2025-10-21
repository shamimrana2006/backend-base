import session from "express-session";
import express from "express";
import app from "../../../app";
export const sessionRouter = express.Router();

 // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 5 },
  })
);
