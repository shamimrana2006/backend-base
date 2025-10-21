import { Request, Response } from "express";
import { error_response, success_response } from "../../services/Response";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { userModel } from "../../model/userModels";
import { emailSender } from "../../config/nodemailer/nodmailerConfig";

export const OTPGenerator = async (req: Request, res: Response) => {
  try {
    const errorMEssages = await errorMessageGet(req);
    if (errorMEssages) {
      return error_response(res, { message: errorMEssages });
    }
    const { email } = req.body;
    const responseUser = await userModel.findOne({ email });
    if (!responseUser) {
      return error_response(res, {
        message: "user not found with this email",
      });
    }

    const otpCreate = Math.floor(100000 + Math.random() * 900000).toString();
    await responseUser.updateOne({
      $set: {
        OTP: {
          value: otpCreate,
          expireIN: new Date(Date.now() + (1000 * 60 * 5)),
        },
      },
    });

    await responseUser.save();
    await emailSender(
      email,
      "Reset Password OTP",
      `<h1>Your OTP</h1><b>${otpCreate}</b>`
    );
    return success_response(res, {
      message: `otp sent successfully check your email ${email}`,
    });
  } catch (error) {}
};
