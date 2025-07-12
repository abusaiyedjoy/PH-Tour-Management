import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import AppError from "../ErrorManage/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
