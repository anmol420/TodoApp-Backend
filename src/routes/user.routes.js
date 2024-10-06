import { Router } from "express";
import { registerUser, logInUser } from "../controllers/user.controller.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { registerSchema, logInSchema } from "../utils/schemas/userValidator.js";

const router = Router();

router.route("/register").post(validationSchema(registerSchema), registerUser);
router.route("/login").post(validationSchema(logInSchema), logInUser);

export default router;