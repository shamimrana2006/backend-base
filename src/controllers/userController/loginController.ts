import { NextFunction, Request, Response } from "express";
import { errorMessageGet } from "../../services/validation/errorMessgaeFilter";
import { error_response, success_response } from "../../services/Response";
import passport from "passport";

export const loginControllelr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationMessage = await errorMessageGet(req);
  if (validationMessage) {
    return error_response(res, { message: validationMessage, status: 400 });
  }
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (!user) {
      return error_response(res, { message: info?.message });
    }
    const { password, ...userWithoutPassword } = user.toObject();

    req.login(user, (errorLogin: any) => {
      if (!errorLogin)
        return success_response(res, {
          message: "login successfully",
          status: 200,
          payload: userWithoutPassword,
        });
      return error_response(res, {
        message: `login failed ${errorLogin.message}`,
      });
    });
  })(req, res, next);
};
