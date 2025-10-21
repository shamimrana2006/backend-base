import { Request, Response } from "express";
import { error_response, success_response } from "../../services/Response";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { userModel, userType } from "../../model/userModels";
import { hashTextGenerator } from "../../services/hashTextGenerator";

export const registerController = async (req: Request, res: Response) => {
  const error = await errorMessageGet(req);
  if (error) {
    return error_response(res, { message: error, status: 404 });
  }

  try {
    const {
      name,
      age,
      email,
      password,
    }: { name: string; age: number; email: string; password: string } =
      req.body;

    const alreadyUser = await userModel.findOne({ email });
    if (alreadyUser) {
      return error_response(res, {
        message: "already register with this email",
        status: 404,
      });
    }
    const hashTExt = await hashTextGenerator(password);
    const createUser = await userModel.insertOne({
      name,
      password: hashTExt,
      email,
      age,
    });

    const { password: passwordd, ...userWithoutPassword } =
      createUser.toObject();

    success_response(res, {
      message: "user created",
      status: 201,
      payload: userWithoutPassword,
    });
  } catch (error: any) {
    error_response(res, {
      message: `user creation failed ${error?.message}`,
      status: 400,
    });
  }
};
