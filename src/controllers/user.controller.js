import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { COOKIE_OPTIONS } from "../constants.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(404, "All Fields Are Required.");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(400, "User Already Exists");
    }

    try {
        const user = await User.create({
            username: username,
            email: email,
            password: password,
        });
        const createdUser = await User.findOne(user._id).select("-password");
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdUser,
                    "User Created.",
                ),
            );
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error.");
    }
});

const generateToken = async (user) => {
    try {
        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '7d',
            },
        );
        return token;
    } catch (error) {
        throw new ApiError(500, "Error In Generating Token.");
    }
}

const isPasswordCorrect = async function (password, user) {
    return await bcrypt.compare(password, user.password);
}

const logInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All Fields Are Required.");
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
        throw new ApiError(404, "User Not Found.");
    }

    const passwordCorrect = await isPasswordCorrect(password, userFound);
    if (!passwordCorrect) {
        throw new ApiError(401, "Incorrect Password.");
    }

    const token = await generateToken(userFound);
    if (!token) {
        throw new ApiError(500, "Error In Generating Token.");
    }

    try {
        const user = await User.findById(userFound._id).select("-password");
        return res
            .status(200)
            .cookie("token", token, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    user,
                    "Logged In."
                )
            );
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const logOutUser = asyncHandler(async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User Logged Out."
                ),
            );
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error.");
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
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    userData,
                    "User Data Found!",
                ),
            );
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error.");
    }
});

// const resetPassword = asyncHandler(async (req, res) => {
//     const { email, oldPassword, newPassword } = req.body;

//     const userFound = await User.findOne({
//         $or: [{ email }]
//     });
//     if (!userFound) {
//         throw new ApiError(404, "User Not Found.");
//     }

//     const isPasswordValid = await userFound.isPasswordCorrect(oldPassword);
//     if (!isPasswordValid) {
//         throw new ApiError(400, "Old Password Invalid.")
//     }

//     try {
//         userFound.password = newPassword;
//         await userFound.save({
//             validateBeforeSave: false,
//         });

//         return res
//             .status(202)
//             .json(
//                 new ApiResponse(
//                     202,
//                     {},
//                     "Passsword Updated Successfully."
//                 )
//             );
//     } catch (error) {
//         throw new ApiError(500, error.message || "Internal Server Error");
//     }
// });


const updateUserUsername = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const user = req.user;

    const userFoundUsername = await User.findOne({
        $or: [{ username }]
    });

    if (userFoundUsername) {
        throw new ApiError(400, "Username Already Exists.");
    }

    try {
        const userFound = await User.findByIdAndUpdate({
            _id: user._id,
        }, {
            $set: {
                username,
            },
        }, {
            new: true,
        }).select("-password");

        return res
            .status(202)
            .json(
                new ApiResponse(
                    202,
                    userFound,
                    "Username Updated."
                ),
            );
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
});

const updateUserEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = req.user;

    const userFoundEmail = await User.findOne({
        $or: [{ email }]
    });

    if (userFoundEmail) {
        throw new ApiError(400, "Email ID Already Exists.");
    }

    try {
        const userFound = await User.findByIdAndUpdate({
            _id: user._id,
        }, {
            $set: {
                email,
            },
        }, {
            new: true,
        }).select("-password");

        return res
            .status(202)
            .json(
                new ApiResponse(
                    202,
                    userFound,
                    "Email Updated."
                ),
            );
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
});

export {
    registerUser,
    logInUser,
    logOutUser,
    dashboard,
    // resetPassword,
    updateUserUsername,
    updateUserEmail
};