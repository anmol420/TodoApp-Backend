import { z } from "zod";

const registerSchema = z.object({
    username: z.string(),
    email: z.string().email({ message: "Invalid Email Format" }),
    password: z.string().min(5, { message: "Minimum Password Length Should Be 5 Characters." }),
});

const logInSchema = z.object({
    email: z.string().email({ message: "Invalid Email Format" }),
    password: z.string().min(5, { message: "Minimum Password Length Should Be 5 Characters." }),
});

export {
    registerSchema,
    logInSchema
};