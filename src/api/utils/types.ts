import {Request} from "express";
import {IUser} from "../models/types";

// interfaces / types
export type FieldErrors = {
    [field: string]: string[]
};

export type ErrorResponse = {
    detail: string | object | object[],
    stack?: string
}

export type Port = string | number;

export interface AuthRequest extends Request {
    user: IUser | null;
}


export class HttpError extends Error {
    statusCode: number;
    message: string;
    errorFields: FieldErrors;
    isFieldValidation: boolean;

    constructor(message: string, statusCode?: number, isFieldValidation: boolean=false, errorFields: FieldErrors={}) {
        super(message);
        this.message = message;
        this.statusCode = statusCode || 500;
        this.isFieldValidation = isFieldValidation;
        this.errorFields = errorFields;
    }
}


