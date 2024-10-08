import { z } from "zod";

const createSchema = z.object({
    title: z.string().min(5, { message: "Title Should Be Greater Than 5 Characters." }),
    description: z.string().min(5, { message: "Description Atleast Contain 5 Characters."}),
    status: z.boolean({ message: "Must Be Either True or False." }),
});

export {
    createSchema,
};