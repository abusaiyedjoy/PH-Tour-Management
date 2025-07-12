/* eslint-disable no-console */
import { envVars } from "../config/env";
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";

export const createSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdmin) {
      console.log("Super Admin already exists");
      return;
    }
    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const superAdmin: IUser = await User.create({
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auth: [authProvider],
    });
    console.log("Super Admin created successfully", superAdmin);
    return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
