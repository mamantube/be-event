import crypto from "crypto";
import { ENCRYPT_PASSWORD } from "./env";

export const encrypt = (password: string): string => {
    const encrypted = crypto.pbkdf2Sync(password, ENCRYPT_PASSWORD, 1000, 64, "sha512").toString("hex");

    return encrypted;
}