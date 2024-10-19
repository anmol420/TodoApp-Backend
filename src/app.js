import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ROUTE_PATH } from "./constants.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({
    limit: "16kb",
}));

app.use(express.static(publicDir));

app.use(cookieParser());

// health check route
import healthCheckRoute from "./routes/healthCheck.routes.js";
app.use(`${ROUTE_PATH}`, healthCheckRoute);

// user routes
import userRoute from "./routes/user.routes.js";
app.use(`${ROUTE_PATH}/user`, userRoute);

// todo routes
import todoRoute from "./routes/todo.routes.js";
app.use(`${ROUTE_PATH}/todo`, todoRoute);

// defined route
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;