import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connect_db = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "db_event"
        })
        return Promise.resolve("Database connected successfully");
    } catch (error) {
        return Promise.reject(error)
    }
}

export default connect_db;
