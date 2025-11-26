import {Request, Response} from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

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
    password: Yup.string().required().min(6, "Password must be at least 6 caracters").test(
        "at-least-one-uppercase-letter", 
        "Contains at least one uppercase letter", 
        (value) => {
            if (!value) return false;
            const regex = /^(?=.*[A-Z])/;
            return regex.test(value);
        }).test(
        "at-least-one-number", 
        "Contains at least one number", 
        (value) => {
            if (!value) return false;
            const regex = /^(?=.*\d)/;
            return regex.test(value);
        }),
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
        /**
         #swagger.requestBody = {
           required: true,
           schema: {$ref: "#/components/schemas/LoginRequest"}
          }
         */
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
                is_active: true,
            });
            
            if (!userByIdentifier) {
                return res.status(401).json({ message: "Email or user name not registered" });
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(401).json({ message: "Password is incorrect"})
            }

            const token = generateToken({
               id: userByIdentifier._id,
               role: userByIdentifier.role,
            })

            res.status(200).json({ message: "Login succesfully", data: token});
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message
            })
        }
    },

    async me(req: IReqUser, res: Response) {
        /**
         * #swagger.security = [{
         *  "bearerAuth: []"
         * }]
         */
        try {
            const user = req.user;

            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user data",
                data: result,
            })
            
        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                message: err.message
            })

        }
    },
    async activation(req: Request, res: Response) {
        try {          
            const { code } = req.body as { code: string };
    
            const user = await UserModel.findOneAndUpdate(
                {
                    activation_code: code
                },
                {
                    is_active: true,
                },
                {
                    new: true,
                }
            )

            res.status(200).json({
                message: "Account activation success",
                data: user,
            })
        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                message: err.message
            })
        }
        
    }
}