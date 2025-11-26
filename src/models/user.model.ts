import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, ISendMail, sendMail } from "../utils/mail/mail"
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface User {
    full_name: string;
    user_name: string;
    phone_number: string;
    email: string;
    password: string;
    role: string;
    profile_picture: string;
    is_active: boolean;
    activation_code: string;
    created_at: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    full_name: {
        type: Schema.Types.String,
        required: true,
    },
    user_name: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user"
    },
    profile_picture: {
        type: Schema.Types.String,
        default: "userpp.jpg",
    },
    is_active: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activation_code: {
        type: Schema.Types.String,
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
});

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    user.activation_code = encrypt(user.id)
    next();
});

UserSchema.post("save", async function (doc, next) {
    try {
        const user = doc;
        
        console.log("Send mail to:", user.email);
    
        const contentEmail = await renderMailHtml("registration-success.ejs", {
            user_name: user.user_name,
            full_name: user.full_name,
            email: user.email,
            created_at: user.created_at,
            activation_link: `${CLIENT_HOST}/auth/activation?code=${user.activation_code}`
        });
        
        await sendMail({
            from: EMAIL_SMTP_USER, 
            to: user.email,
            subject: "Aktivasi akun anda",
            html: contentEmail
        })
    } catch (error) {
        console.error(error)
    } finally {
        next();
    }

})

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
