import { z } from "zod";
import ApiResponse from "../utils/ApiResponse.js";

const validationSchema = (schema, source="body") => {
    function validate(req, res, next) {
        try {
            schema.parse(req[source]);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const zError = error.format();
                return res
                    .status(404)
                    .json(new ApiResponse(404, { zError }, "Validation Error"));
            }
        }
    }
    return validate;
}

export default validationSchema;