import { Request, Response } from "express";
import { error_response, success_response } from "../../services/Response";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import jwt from "jsonwebtoken";
import { TOKEN_SECRETE } from "../../config/secrete";
import { hashTextGenerator } from "../../services/hashTextGenerator";
import { userModel } from "../../model/userModels";

export const resetPassWithToken = async (req: Request, res: Response) => {
  try {
    const errorMessageGeting = await errorMessageGet(req);
    if (errorMessageGeting) {
      return error_response(res, { message: errorMessageGeting });
    }
    const { newPassword }: { newPassword: string } = req.body;
    const cookies = req.cookies;
    if (!cookies) {
      return error_response(res, { message: "cookie not available" });
    }
    const { resetPassToken } = cookies;
    if (!resetPassToken) {
      return error_response(res, { message: "token not available" });
    }
    const isValidToken: any = await jwt.verify(resetPassToken, TOKEN_SECRETE);
    if (!isValidToken) {
      return error_response(res, { message: "token not valid" });
    }
    const hasPassword = await hashTextGenerator(newPassword);
    let responseUpdatePass: any = await userModel.findOneAndUpdate(
      {
        email: isValidToken.email,
      },
      { $set: { password: hasPassword } },
      { new: true }
    );
    const plainObjectUser = responseUpdatePass.toObject();
    const { password, ...newUser } = plainObjectUser;
    res.clearCookie("resetPassToken");
    return success_response(res, {
      message: "user password changed successfully",
      payload: newUser,
    });
  } catch (error: any) {
    return error_response(res, {
      message: "password update problem : " + error.message,
    });
  }
};
