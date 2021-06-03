import {Document, LeanDocument} from "mongoose";

export interface IUser extends Document {
    username: String;
    firstName: String
    lastName: String
    email: String
    password: String
}

export interface IAuthToken extends Document {
    user: String | IUser,
    token: String
}

export type TUser = {
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

export type TUserTokenInfo = {
    _id: string,
    username: String,
    firstName: String,
    lastName: String
};

export type TAuthToken = {
    user: String | IUser,
    token: String
}