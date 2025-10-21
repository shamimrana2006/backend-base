import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { BACKEND_ORIGIN, GOOGLE_ID, GOOGLE_SECRET } from "../../secrete";
import { userModel } from "../../../model/userModels";

passport.use(
  new Strategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: `${BACKEND_ORIGIN}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile: any, done) => {
      console.log(profile.emails[0].value);
      const user = {
        email: profile.emails[0].value,
      };

      try {
        const findUser: any = await userModel.findOne({
          email: profile.emails[0].value,
        });
        const user = {
          email: profile.emails[0].value,
        };
        if (!findUser) {
          await userModel.insertOne({
            name: profile.displayName,
            password: profile.emails?.[0]?.value,
            email: profile.emails?.[0]?.value,
            photoURL: profile.photos?.[0]?.value,
            verified: true,
          });
        }
        return done(null, user);
      } catch (error) {
        done(error, false);
      }

      done(null, user);
    }
  )
);
