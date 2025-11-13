import {Request, Response} from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";

type TRegister = {
    full_name: string;
    user_name: string;
    phone_number: string;
    email: string;
    password: string;
    confirm_password: string;
}

type TLogin = {
    identifier: string;
    password: string;
}

const schemaValidation = Yup.object({
    full_name: Yup.string().required(),
    user_name: Yup.string().required(),
    phone_number: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirm_password: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password not match"),
})

export default {
    async register(req: Request, res: Response) {
        const { full_name, user_name,phone_number, email, password, confirm_password} = req.body as unknown as TRegister;

        try {
            await schemaValidation.validate({
                full_name,
                user_name,
                phone_number,
                email,
                password,
                confirm_password
            });

            const result = await UserModel.create({
                full_name,
                user_name,
                phone_number,
                email,
                password,
            })
            
            res.status(201).json({
                message: "Registration success",
                data: result,
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message
            })
        }
    },

    async login(req: Request, res: Response) {
        const { identifier, password } = req.body as unknown as TLogin;
        try {
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        user_name: identifier,
                    }
                ],
            });
            
            if (!userByIdentifier) {
                return res.status(401).json({ message: "Email or user name not registered" });
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(401).json({ message: "Password is incorrect"})
            }

            res.status(200).json({ message: "Login succesfully", data: userByIdentifier});
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message
            })
        }
    }
}