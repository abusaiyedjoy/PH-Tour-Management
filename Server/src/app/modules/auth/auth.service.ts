import AppError from "../../ErrorManage/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";

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

  const userTokens = createUserToken(isUserExist);

  // delete isUserExist.password;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...user } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: user,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const authService = {
  credentialLogin,
  getNewAccessToken,
};
