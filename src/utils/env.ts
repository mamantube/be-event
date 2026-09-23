import dotenv from "dotenv";

dotenv.config()

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET_KEY_TOKEN: string = process.env.SECRET_KEY_TOKEN || "";