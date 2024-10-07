import { Router } from "express";
import { registerUser, logInUser, logOutUser } from "../controllers/user.controller.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { registerSchema, logInSchema } from "../utils/schemas/userValidator.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validationSchema(registerSchema), registerUser);
router.route("/login").post(validationSchema(logInSchema), logInUser);

// protected route
router.route("/logout").post(verifyJWT, logOutUser);

export default router;