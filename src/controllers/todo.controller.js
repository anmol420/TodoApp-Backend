import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Todo } from "../models/todo.model.js";

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, status } = req.body;
    const user = req.user;
    try {
        const todoFound = await Todo.findOne({
            $or: [{ title }],
        });
        if (todoFound) {
            throw new ApiError(400, "Todo With Same Title Already Exists.")
        }
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
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

const toggleComplete = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const user = req.user;
    try {
        const todoFound = await Todo.findOne({
            title,
            owner: user._id,
        });
        if (!todoFound) {
            throw new ApiError(404, "Todo Not Found");
        }
        const updatedTodo = await Todo.findByIdAndUpdate({
            _id: todoFound._id,
        }, {
            isCompleted: !todoFound.isCompleted,
        }, {
            new: true,
        });
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedTodo,
                "OK"
            ));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

export {
    createTodo,
    toggleComplete,
};