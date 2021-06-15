import {Document, LeanDocument, ObjectId, Model} from "mongoose";

/**
 * * USER TYPES
 */
export const ROLES = {
    0: "ADMINISTRATOR",
    1: "CLIENT",
    2: "SELLER_CLIENT"
}

export enum URole {
    ADMINISTRATOR = 0,
    CLIENT = 1,
    SELLER_CLIENT = 2
}
export interface User {
    username: String;
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    role: URole,
}

export interface UserDocument extends User, Document {
    fullName: string;
    getRole(): string;
    isValidPassword(password: string, cb: Function): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {

}

export interface UserLeanDocument extends LeanDocument<UserDocument>{

}

/**
 * * BOOK TYPES
 */
export interface Book {
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
    isbn: String,
    description: String,
    seller: SellerObjectId | SellerPopulated
}

export interface BookBaseDocument  extends Book, Document {

}

export interface BookDocument extends BookBaseDocument {
    seller: SellerObjectId
}

export interface BookModel extends Model<BookDocument> {

}

export interface BookPopulatedDocument extends BookBaseDocument {
    seller: SellerPopulated;
}

type SellerObjectId = {
    _id: ObjectId;
    firstName: String;
    lastName: String;
};

interface SellerPopulated {
    _id: User;
    firstName: String;
    lastName: String;
};


/**
 * * AUTH TOKEN TYPES
 */
export interface IUserTokenInfo {
    _id: ObjectId
    username: String,
    fullName: string,
    role: string
};
export interface AuthToken {
    user: ObjectId | User
    token: String
}
export interface AuthTokenBaseDocument extends AuthToken, Document {
}

export interface AuthTokenDocument extends AuthTokenBaseDocument {
    user: ObjectId;
}

export interface AuthTokenPopulatedDocument extends AuthTokenBaseDocument {
    user: User;
}