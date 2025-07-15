import AppError from "../../ErrorManage/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { User } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

//Manually login

// const credentialLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
//   }

//   const userTokens = createUserToken(isUserExist);

//   // delete isUserExist.password;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...user } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: user,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    if (newPassword === oldPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "New password cannot be same as old password");
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    await user.save();
};


export const authService = {
  getNewAccessToken,
  resetPassword
};
