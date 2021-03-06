import {Schema, model} from "mongoose";
import {UserDocument, UserModel, ROLES, URole} from "./types";
import * as bcrypt from "bcryptjs";

const userSchema = new Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [0, 1, 2],
        default: URole.CLIENT,
        required: true,
    },
});

userSchema.index({firstName: "text", lastName: "text"}, {name: "name search index"});

userSchema.virtual("fullName").get(function (this: UserDocument): string {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.getRole = function (this: UserDocument): string {
    return ROLES[this.role];
};

userSchema.methods.isValidPassword = function(this: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password as string);
}

export default model<UserDocument, UserModel>("User", userSchema);