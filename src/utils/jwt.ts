import { Types } from "mongoose"
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { ENCRYPT_PASSWORD } from "./env";

export interface IUserToken extends Omit<User, "password" | "activation_code" | "is_active" | "email" | "full_name" | "profile_picture" | "user_name" | "phone_number"> {
    id?: Types.ObjectId;
}

export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, ENCRYPT_PASSWORD, {
        expiresIn: "1h",
    });

    return token;
}

export const getUserData = (token: string) => {
    const user = jwt.verify(token, ENCRYPT_PASSWORD) as IUserToken;

    return user;
}