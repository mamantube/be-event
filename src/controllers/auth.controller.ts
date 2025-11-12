import {Request, Response} from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";

type TRegister = {
    full_name: string;
    user_name: string;
    phone_number: string;
    email: string;
    password: string;
    confirm_password: string;
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
}