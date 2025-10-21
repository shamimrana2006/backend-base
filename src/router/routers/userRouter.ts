import express, { Request, Response } from "express";
import { error_response, success_response } from "../../services/Response";
import { body } from "express-validator";
import passport from "passport";
import { FRONTEND_ORIGIN } from "../../config/secrete";
import { registerController } from "../../controllers/userController/RegisterContoller";
import { loginControllelr } from "../../controllers/userController/loginController";
import { isLoggedIn } from "../../middlewares/isLoggedin";
import { profileController } from "../../controllers/userController/profile";
import { updateProfile } from "../../controllers/userController/profileupdate";
import { emailSender } from "../../config/nodemailer/nodmailerConfig";

import { OTPGenerator } from "../../controllers/userController/OTPresetPassword";
import rateLimit from "express-rate-limit";
import { resetTokenCreator } from "../../controllers/userController/resetTokenCreator";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { userModel } from "../../model/userModels";
import { resetPassWithToken } from "../../controllers/userController/resetPassWithToken";
import { resetPasswordWtihOldPassword } from "../../controllers/userController/resetPassword";
import { isAdmin } from "../../middlewares/isAdmin";
export const UserRouter = express.Router();

const validationRegister: any[] = [
  body("email")
    .notEmpty()
    .withMessage("email required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("invalid email format"),
  ,
  body("name").notEmpty().withMessage("name required"),
  body("password")
    .notEmpty()
    .withMessage("password required")
    .matches(/^(?=.*[A-Z]).{6,}$/)
    .withMessage(
      "password must be at least 6 characters and include one uppercase letter"
    ),
];
const validationLogin: any[] = [
  body("email").notEmpty().withMessage("email required"),
  body("password").notEmpty().withMessage("password required"),
];

UserRouter.post("/register", validationRegister, registerController);
UserRouter.post("/login", validationLogin, loginControllelr);
UserRouter.get("/logout", async (req: Request, res: Response) => {
  req.logOut(() => {
    return success_response(res, { message: "successfully logout" });
  });
});

//google
UserRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  })
);
UserRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  async (req: Request, res: Response) => {
    console.log(req?.user);
    if (!req?.user) {
      return error_response(res, { message: "user not found from google" });
    }
    res.redirect(FRONTEND_ORIGIN);
  }
);

// user get and update
UserRouter.get("/profile", isLoggedIn, profileController);
UserRouter.put("/Updateprofile", isLoggedIn, updateProfile);

// forgot password
const perMinuteLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: "Please wait 1 minute before sending another OTP.",
});

const perHourLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // ১ ঘণ্টা
  max: 3,
  message: "Too many OTP requests. Please try again after 1 hour.",
});

UserRouter.post(
  "/forgotpassotp",
  perMinuteLimit,
  perHourLimit,
  [body("email").notEmpty().withMessage("email required")],
  OTPGenerator
);
UserRouter.post(
  "/forgotTokenCreator",
  [
    body("email").notEmpty().withMessage("email required"),
    body("otp").notEmpty().withMessage("otp required"),
  ],
  resetTokenCreator
);

UserRouter.post(
  "/forgotPassWithToken",
  [body("newPassword").notEmpty().withMessage("newPassword is required")],
  resetPassWithToken
);

UserRouter.post(
  "/resetPassword",
  isLoggedIn,
  [
    body("newPassword").notEmpty().withMessage("newPassword required"),
    body("oldPassword").notEmpty().withMessage("oldPassword required"),
  ],
  resetPasswordWtihOldPassword
);

// admin controller

UserRouter.get("/users", isAdmin, async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await userModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    if (limit > 10) limit = 10;

    if (
      Number(req.query.page) < 1 ||
      Number(req.query.page) > Number(totalPages)
    ) {
      return error_response(res, { message: "this page not available" });
    }
    const users = await userModel.find({}).skip(skip).limit(limit).lean();
    success_response(res, { message: totalPages.toString(), payload: users });
  } catch (error: any) {
    error_response(res, { message: "user finding error : " + error.message });
  }
});

UserRouter.put(
  "/user/:id/role",
  isAdmin,
  [body("role").notEmpty().withMessage("role is required")],
  async (req: Request, res: Response) => {
    try {
      const roleMessage = await errorMessageGet(req);
      if (roleMessage) {
        return error_response(res, { message: roleMessage });
      }
      const userId = req.params.id;

      const userFind: any = await userModel.findOne({ _id: userId });
      if (!userFind) {
        return error_response(res, { message: "user not found" });
      }
      const user = userFind.toObject();

      userFind.role = req.body.role;
      await userFind.save();
      await emailSender(
        user.email,
        "role changed by admin",
        `Your role change by admin:${(req as any).user.name}. now yur role is ${
          req.body.role
        }`
      );

      // emailSender()
      return success_response(res, {
        message: "user role change successfully",
      });
    } catch (error: any) {
      console.log(error);

      return error_response(res, { message: error.message });
    }
  }
);

UserRouter.delete(
  "/user/:id",
  isAdmin,

  async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      const userFind: any = await userModel.findOne({ _id: userId });
      if (!userFind) {
        return error_response(res, { message: "user not found" });
      }
      const user = userFind.toObject();

      await userFind.deleteOne();
      await emailSender(
        user.email,
        "permanently delete you account by admin",
        `Your account delete by admin:${
          (req as any).user.name
        }. now you can create new account with this email ${userFind.email}`
      );

      // emailSender()
      return success_response(res, {
        message: `${req.params.id} user delete successfully`,
      });
    } catch (error: any) {
      console.log(error);

      return error_response(res, { message: error.message });
    }
  }
);
