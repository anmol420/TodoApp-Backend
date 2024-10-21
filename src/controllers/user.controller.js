import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { StatusCodes } from "http-status-codes";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User Already Exists");
    }

    try {
        const user = await User.create({
            username: username,
            email: email,
            password: password,
        });
        const createdUser = await User.findOne(user._id).select("-password");
        return res
            .status(StatusCodes.CREATED)
            .json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    createdUser,
                    "User Created.",
                ),
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error.");
    }
});

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token = user.generateToken();
        return token;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error.");
    }
}

const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (!userFound) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User Not Found.");
    }

    const passwordValid = await userFound.isPasswordCorrect(password);
    if (!passwordValid) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Invalid Password.");
    }

    try {
        const token = await generateToken(userFound._id);
        const user = await User.findById(userFound._id).select("-password");
        return res
            .status(StatusCodes.OK)
            .cookie("token", token, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    user,
                    "User Logged In.",
                ),
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error.");
    }
});

const logOutUser = asyncHandler(async (req, res) => {
    try {
        return res
            .status(StatusCodes.OK)
            .clearCookie("token", COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    {},
                    "User Logged Out."
                ),
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error.");
    }
});

const dashboard = asyncHandler(async (req, res) => {
    const user = req.user;

    const userData = await User.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $lookup: {
                from: "todos",
                localField: "_id",
                foreignField: "owner",
                as: "todos"
            },
        },
        {
            $project: {
                username: 1,
                email: 1,
                todos: {
                    title: 1,
                    description: 1,
                    dateModified: 1,
                    isCompleted: 1,
                },
            },
        },
    ]);

    if (!userData?.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Not Found.");
    }

    try {
        return res
            .status(StatusCodes.OK)
            .json(
                new ApiResponse(
                    StatusCodes.OK,
                    userData,
                    "User Data Found!",
                ),
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error.");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    const userFound = await User.findOne({
        $or: [{ email }]
    });
    if (!userFound) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User Not Found.");
    }

    const isPasswordValid = await userFound.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Old Password Invalid.")
    }

    try {
        userFound.password = newPassword;
        await userFound.save({
            validateBeforeSave: false,
        });

        return res
            .status(StatusCodes.CREATED)
            .json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    {},
                    "Passsword Updated Successfully."
                )
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error");
    }
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const user = req.user;

    const userFoundEmail = await User.findOne({
        $or: [{email}]
    });

    const userFoundUsername = await User.findOne({
        $or: [{username}]
    });

    if(userFoundUsername) {
        throw new ApiError(StatusCodes.CONFLICT, "Username Already Exists.");
    }

    if(userFoundEmail) {
        throw new ApiError(StatusCodes.CONFLICT, "Email ID Already Exists.");
    }

    try {
        const userFound = await User.findByIdAndUpdate({
            _id: user._id,
        }, {
            $set: {
                username,
                email
            },
        }, {
            new: true,
        }).select("-password");

        return res
            .status(StatusCodes.CREATED)
            .json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    userFound,
                    "User Details Updated."
                ),
            );
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Internal Server Error");
    }
});

export {
    registerUser,
    logInUser,
    logOutUser,
    dashboard,
    resetPassword,
    updateUserDetails,
};