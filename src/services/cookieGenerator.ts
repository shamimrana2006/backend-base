import { Response } from "express";

interface CookieOptions {
  isSecure?: boolean;
  cookieName?: string;
  cookieValue?: string;
  maxAgeMinute?: number; // milliseconds
}

export const cookieGenerate = (
  res: Response,
  {
    isSecure = true,
    cookieName = "token",
    cookieValue = "",
    maxAgeMinute = 60 * 60 * 1000, // 1 hour default
  }: CookieOptions
): void => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true, // always keep cookies httpOnly
    secure: isSecure, // true if HTTPS
    sameSite: isSecure ? "none" : "lax", // cross-site cookie if secure
    maxAge: maxAgeMinute * 60 * 1000,
    path: "/",
  });
};