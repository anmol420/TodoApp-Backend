import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
        console.log(`Database Connected At: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Database Error: ${error}`);
    }
};

export { connectDB };