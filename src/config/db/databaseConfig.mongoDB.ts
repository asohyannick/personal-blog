import 'dotenv/config';
import mongoose from 'mongoose';
const MONGODB_URL: string = process.env.MONGODB_URL as string;
const databaseConfig = async() => {
    try {
        await mongoose.connect(MONGODB_URL as string);
        console.log("Connected to the DB successfully");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        } else {
            console.log("Failed to connect to DB", error);
        }
    }
}

export default databaseConfig;
