/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status-codes";
import AppError from "../../ErrorManage/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setAuthCookie";


const credentialLogin = async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.credentialLogin(req.body);

    setAuthCookie(res, data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: data,
    });
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }
    const tokenInfo = await authService.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    })
})

const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax" });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: {},
    })
})

export const authController = {
    credentialLogin,
    getNewAccessToken,
    logOut
};