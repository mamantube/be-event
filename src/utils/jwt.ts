import jwt from "jsonwebtoken"
import { SECRET_KEY_TOKEN } from "./env"

export interface IUserToken {
    id: string;
    role: string;
}

export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET_KEY_TOKEN, {
        expiresIn: "1h",
    });
    return token;
}

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET_KEY_TOKEN) as IUserToken;

    return user;
}
