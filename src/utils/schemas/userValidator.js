import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(5, { message: "Minimum Username Length Should Be 5 Characters." }),
    email: z.string().email({ message: "Invalid Email Format" }),
    password: z.string().min(5, { message: "Minimum Password Length Should Be 5 Characters." }),
});

const logInSchema = z.object({
    email: z.string().email({ message: "Invalid Email Format" }),
    password: z.string().min(5, { message: "Minimum Password Length Should Be 5 Characters." }),
});

const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid Email Format" }),
    oldPassword: z.string({ message: "Old Password Must Be Provided." }),
    newPassword: z.string().min(5, { message: "Minimum Password Length Should Be 5 Characters." })
});

const updateUserDetailsSchema = z.object({
    username: z.string().min(5, { message: "Minimum Username Length Should Be 5 Characters." }),
    email: z.string().email({ message: "Invalid Email Format" }),
});

export {
    registerSchema,
    logInSchema,
    resetPasswordSchema,
    updateUserDetailsSchema,
};