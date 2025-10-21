import { Request, Response } from "express";
import { userModel } from "../../model/userModels";
import { error_response, success_response } from "../../services/Response";
import bcrypt from "bcryptjs";
import { hashTextGenerator } from "../../services/hashTextGenerator";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";

export const resetPasswordWtihOldPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const errorMessage = await errorMessageGet(req);
    if (errorMessage) {
      return error_response(res, { message: errorMessage });
    }
    const { newPassword, oldPassword } = req.body;

    const email = (req as any)?.user?.email;

    const findingUser = await userModel.findOne({ email });
    if (!findingUser) {
      return error_response(res, { message: "user not found" });
    }
    const plainUserObject = findingUser.toObject();
    //   console.log(plainUserObject);

    const isMatchOldPassword = await bcrypt.compare(
      oldPassword,
      plainUserObject.password
    );
    if (!isMatchOldPassword) {
      return error_response(res, { message: "old Password not match" });
    }
    const hashPassword = await hashTextGenerator(newPassword);
    findingUser.password = hashPassword;
    await findingUser.save();
    return success_response(res, {
      message: "user password changed successfully",
    });
  } catch (error: any) {
    return error_response(res, {
      message: "password update problem:" + error.message,
    });
  }
};
