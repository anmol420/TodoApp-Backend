import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ROUTE_PATH } from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({
    limit: "16kb",
}));

app.use(cookieParser());

// health check route
import healthCheckRoute from "./routes/healthCheck.routes.js";
app.use(`${ROUTE_PATH}`, healthCheckRoute);

// user routes
import userRoute from "./routes/user.routes.js";
app.use(`${ROUTE_PATH}`, userRoute);

export default app;