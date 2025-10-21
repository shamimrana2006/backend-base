import { Request, Response } from "express";
import { success_response } from "../../services/Response";
import { userModel, userType } from "../../model/userModels";

export const updateProfile = async (req: Request, res: Response) => {
  const { name = "", age = 0, photoURL = "" }: userType = req?.body;
  const updateData: any = {};

  if (name) updateData.name = name;
  if (age) updateData.age = age;
  if (photoURL) updateData.photoURL = photoURL;
  await userModel.findOneAndUpdate(
    { _id: (req as any).user._id },
    {
      $set: { updateData },
    },
    { new: true }
  );
  return success_response(res, {
    message: "profile success",
    payload: req.user,
  });
};
