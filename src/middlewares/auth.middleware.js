import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";

const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized Request.");
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Invalid Token.");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, error?.message || "Invalid Access Token.");
    }
});

export default verifyJWT;