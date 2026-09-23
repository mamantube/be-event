import { Request, Response } from "express";
import UserModel from "../models/user.model";
import * as Yup from "yup";
import bccrypt from "bcrypt";

type TRegister = {
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
};

const validationSchema = Yup.object({
  full_name: Yup.string().required(),
  user_name: Yup.string().required(),
  email: Yup.string().email().required(),
  phone_number: Yup.string().required(),
  password: Yup.string().required(),
  confirm_password: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password tidak sama"),
});

export default {
  async register(req: Request, res: Response) {
    const {
      full_name,
      user_name,
      email,
      phone_number,
      password,
      confirm_password,
    } = req.body as unknown as TRegister;

    try {
      await validationSchema.validate({
        full_name,
        user_name,
        email,
        phone_number,
        password,
        confirm_password,
      });

      const saltRounds = 10;
      const passwordHashing = await bccrypt.hash(
        password,
        saltRounds,
      )

      const result = await UserModel.create({
        full_name,
        user_name,
        email,
        phone_number,
        password: passwordHashing,
      })

      res.status(200).json({
        message: "Registration success",
        data: result,
      })
    } catch (error) {
        const err = error as unknown as Error;
        
        res.status(400).json({
            message: err.message,
            data: null,
        })
    }
  },
};
