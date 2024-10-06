import { Router } from "express";
import { registerUser, logInUser } from "../controllers/user.controller.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { registerSchema } from "../utils/schemas/userValidator.js";

const router = Router();

router.route("/register").post(validationSchema(registerSchema), registerUser);
router.route("/login").post(logInUser);

export default router;