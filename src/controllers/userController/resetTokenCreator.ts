import { Request, Response } from "express";
import { userModel } from "../../model/userModels";
import { error_response, success_response } from "../../services/Response";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { TokenGenerator } from "../../services/TokenGenerator";
import { cookieGenerate } from "../../services/cookieGenerator";

export const resetTokenCreator = async (req: Request, res: Response) => {
  try {
    const erorrMessages = await errorMessageGet(req);
    if (erorrMessages) {
      return error_response(res, { message: erorrMessages });
    }
    const { email, otp } = req.body;
    let userOTP: any = await userModel.findOne({ email });
    if (!userOTP) {
      return error_response(res, { message: "user not found" });
    }

    const plainUserOtp = userOTP.toObject();
    const { password, ...user } = plainUserOtp;
    if (!(user.OTP.value == otp)) {
      return error_response(res, { message: "otp invalid" });
    }

    if (user.OTP.expireIN < Date.now()) {
      return error_response(res, { message: "otp expire" });
    }
    const isSEcure = req.secure;
    const token = await TokenGenerator(user, "5m");
    await cookieGenerate(res, {
      isSecure: isSEcure,
      cookieName: "resetPassToken",
      cookieValue: token,
      maxAgeMinute: 5,
    });

    userOTP.OTP.value = "";
    await userOTP.save();
    // res.cookie("resetPass", token);
    return success_response(res, { message: "token create success" });
  } catch (error: any) {
    return error_response(res, { message: error.message });
  }
};
