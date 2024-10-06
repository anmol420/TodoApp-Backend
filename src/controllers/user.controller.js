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

export {
    registerUser,
    logInUser
};