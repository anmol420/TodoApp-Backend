import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";

const healthCheck = asyncHandler( async (req, res) => {
    try {
        return res
            .status(StatusCodes.OK)
            .json(new ApiResponse(StatusCodes.OK, "All Good !"));
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error.");
    }
});

export {
    healthCheck
};