import passport from "passport";
import { Strategy } from "passport-local";
import { userModel } from "../../../model/userModels";
import bcrypt from "bcryptjs";

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    console.log("ami strategy bolci");

    try {
      const findUser: any = await userModel.findOne({ email: email });

      if (!findUser) {
        return done(null, false, { message: "user not found" });
      }
      const checkingPassword = await bcrypt.compare(
        password,
        findUser.password
      );
      if (!checkingPassword) {
        return done(null, false, { message: "invalid credential" });
      }
     
     return done(null, findUser);
    } catch (error) {
      done(error);
    }
  })
);
