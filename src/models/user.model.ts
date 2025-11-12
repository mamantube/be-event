import mongoose from "mongoose";

export interface User {
    full_name: string;
    user_name: string;
    phone_number: string;
    email: string;
    password: string;
    role: string;
    profile_picture: string;
    is_avtive: boolean;
    activation_code: string;
}

const Schema = mongoose.Schema;

const user_schema = new Schema<User>({
    full_name: {
        type: Schema.Types.String,
        required: true,
    },
    user_name: {
        type: Schema.Types.String,
        required: true,
    },
    phone_number: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
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
    is_avtive: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activation_code: {
        type: Schema.Types.String,
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model("User", user_schema);

export default UserModel;
