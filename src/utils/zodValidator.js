import { z } from "zod";

const userValidator = function(user) {
    const userSchema = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(5),
    });
    try {
        userSchema.parse(user)
        return true;
    } catch (error) {
        return false;
    }
};

export {
    userValidator,
};