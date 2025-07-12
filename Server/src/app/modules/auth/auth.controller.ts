/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status-codes";


const credentialLogin = async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.credentialLogin(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: data,
    });
};

export const authController = {
    credentialLogin,
};