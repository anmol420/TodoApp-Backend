import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { COOKIE_OPTIONS } from "../constants.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

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

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token = user.generateToken();
        return token;
    } catch (error) {
        throw new ApiError(500, "Internal Server Error.");
    }
}

const logInUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        throw new ApiError(400, "Email & Password Are Required.");
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
        throw new ApiError(404, "User Not Found.");
    }

    const passwordValid = await userFound.isPasswordCorrect(password);
    if (!passwordValid) {
        throw new ApiError(404, "Invalid Password.");
    }

    const token = await generateToken(userFound._id);

    const user = await User.findById(userFound._id).select("-password");

    return res
        .status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                user,
                "User Logged In.",
            ),
        );
});

const logOutUser = asyncHandler( async (req, res) => {
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
});

const dashboard = asyncHandler( async (req, res) => {
    const user = req.user;
    try {
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
            throw new ApiError("")
        }

        console.log(userData[0].todos[0]);
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
        throw new ApiError(500, "Internal Server Error.");
    }
});

export {
    registerUser,
    logInUser,
    logOutUser,
    dashboard,
};