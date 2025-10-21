import jwt from "jsonwebtoken";
import { TOKEN_SECRETE } from "../config/secrete";

export const TokenGenerator = async (payload: any, expireIN: string) => {
  let token;
  token = jwt.sign(payload, TOKEN_SECRETE, {
    expiresIn: expireIN as any,
  });
  return token;
};
