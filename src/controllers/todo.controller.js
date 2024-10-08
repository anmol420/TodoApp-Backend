import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.model.js";
import { StatusCodes } from "http-status-codes";

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, status } = req.body;
    const user = req.user;
    try {
        const todo = await Todo.create({
            title,
            description,
            dateModified: new Date(Date.now()),
            isCompleted: status,
            owner: user._id,
        });
        if (!todo) {
            throw new ApiError(500, "Todo Creation Failed.");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {},
                    "Todo Creation Successfull.",
                )
            );
    } catch (error) {
        // console.log(error);
        throw new ApiError(500, "Error");
    }
});

export {
    createTodo,
};