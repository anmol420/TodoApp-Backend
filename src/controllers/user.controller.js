import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { userValidator } from "../utils/zodValidator.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!userValidator({ username, email, password })) {
        throw new ApiError(400, "Validation Error");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }

    const user = await User.create({
        username: username,
        email: email,
        password: password,
    });

    const createdUser = await User.findOne(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Internal Server Error");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User Created.",
            ),
        );
});

export {
    registerUser
};