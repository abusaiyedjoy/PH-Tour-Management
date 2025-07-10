import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const user = await User.create({
    name,
    email,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  const usersCount = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: usersCount,
    },
  };
};

export const UserService = {
  createUser,
  getAllUsers,
};
