import AppError from "../../ErrorManage/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return { accessToken };
};

export const authService = {
  credentialLogin,
};
