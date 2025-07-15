import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import passport from "passport";

const router = Router();

router.post('/login', authController.credentialLogin)
router.post('/refresh-token', authController.credentialLogin)
router.post('/logout', authController.logOut)
router.post("/reset-password", checkAuth(...Object.values(Role)), authController.resetPassword)
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authController.googleCallbackController)

export const AuthRoutes = router;