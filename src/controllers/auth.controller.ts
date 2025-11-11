import {Request, Response} from "express"

type TRegister = {
    full_name: string;
    user_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export default {
    register(req: Request, res: Response) {
        const { full_name, user_name, email, password, confirm_password} = req.body as unknown as TRegister;
    },
}