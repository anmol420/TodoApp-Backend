import { z } from "zod";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

const validationSchema = (schema, source="body") => {
    function validate(req, res, next) {
        try {
            schema.parse(req[source]);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const zError = error.format();
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json(new ApiResponse(StatusCodes.NOT_FOUND, { zError }, "Validation Error"));
            }
        }
    }
    return validate;
}

export default validationSchema;