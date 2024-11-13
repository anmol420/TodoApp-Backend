import { Router } from "express";
import { registerUser, logInUser, logOutUser, dashboard, updateUserUsername, updateUserEmail, resetPassword } from "../controllers/user.controller.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { registerSchema, logInSchema, resetPasswordSchema, updateUserUsernameSchema, updateUserEmailSchema } from "../utils/schemas/userValidator.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validationSchema(registerSchema), registerUser);
router.route("/login").post(validationSchema(logInSchema), logInUser);
router.route("/resetPassword").patch(validationSchema(resetPasswordSchema), resetPassword);  

// protected route
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/dashboard").get(verifyJWT, dashboard);
router.route("/updateUserUsername").patch(verifyJWT, validationSchema(updateUserUsernameSchema), updateUserUsername);
router.route("/updateUserEmail").patch(verifyJWT, validationSchema(updateUserEmailSchema), updateUserEmail)

export default router;