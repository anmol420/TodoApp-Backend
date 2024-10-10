import { Router } from "express";
import { createTodo, toggleStatus } from "../controllers/todo.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import validationSchema from "../middlewares/zodValidator.middleware.js";
import { createSchema } from "../utils/schemas/todoValidator.js";

const router = Router();

// secured Route
router.route("/createTodo").post(verifyJWT, validationSchema(createSchema), createTodo);
router.route("/toggleStatus").post(verifyJWT, toggleStatus);

export default router;