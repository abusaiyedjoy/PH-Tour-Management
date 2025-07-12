/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId  = req.params.id;
  const verifiedToken = req.user;
  const payload = req.body;
  const user = await UserService.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
};

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
