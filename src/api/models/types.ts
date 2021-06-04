import {Document, LeanDocument} from "mongoose";

export type TUser = {
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

export type TBook = {
    title: String;
    subtitle?: String;
    author: String[];
    publisher: String;
    quantity: Number;
    pages: String;
    price: Number;
    lenguage: String;
    published: Date;
    category: String;
    isbn: String
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
export interface IUser extends Document, TUser {
}

export interface ILeanUser extends LeanDocument<IUser>{
}

export interface IBook  extends Document, TBook {
}

export interface ILeanBook  extends LeanDocument<IBook> {
}

export interface IAuthToken extends Document, TAuthToken {
}
export interface ILeanAuthToken extends Document<IAuthToken> {
}

