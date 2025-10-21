import express, { Application, NextFunction, Request, Response } from "express";
import "./config/passport/strategy/localStrategy";
import "./config/passport/strategy/googleStrategy";
import { connectionDB } from "./model/connectionDB";
import { error_response } from "./services/Response";
import session from "express-session";
import passport from "passport";
import { userModel } from "./model/userModels";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";
import MongoStore from "connect-mongo";
import { DB_URL } from "./config/secrete";
import { AllRouter } from "./router/allRoutert";
import cookieParser from "cookie-parser";
const app: Application = express();

connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    store: MongoStore.create({
      mongoUrl: DB_URL,
      collectionName: "session",
    }),
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 5 },
  })
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: any, done) {
  console.log("ami serialization user");
  console.log(user);
  if (!user) return done(null, null);
  done(null, user.email);
});
passport.deserializeUser(async (id, done) => {
  console.log("ami desirialize user", id);
  const findUser: any = await userModel.findOne({ email: id });
  const { password, ...userWithoutPassword } = findUser?.toObject();
  done(null, userWithoutPassword);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ name: "developed by shamim rana +880 19 0961 6418" });
});
app.use(AllRouter);

// error handling ----------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next();
  }
  throw new Error("router not found");
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  error_response(res, { status: err.status, message: err.message });
});

export default app;
