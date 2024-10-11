import { Router } from "express";
import { registerUser, logInUser, logOutUser, dashboard, resetPassword, updateUserDetails } from "../controllers/user.controller.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { registerSchema, logInSchema, resetPasswordSchema, updateUserDetailsSchema } from "../utils/schemas/userValidator.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validationSchema(registerSchema), registerUser);
router.route("/login").post(validationSchema(logInSchema), logInUser);
router.route("/resetPassword").post(validationSchema(resetPasswordSchema), resetPassword);

// protected route
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/dashboard").get(verifyJWT, dashboard);
router.route("/updateUserDetails").patch(verifyJWT, validationSchema(updateUserDetailsSchema), updateUserDetails);

export default router;