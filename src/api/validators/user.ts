import { body, CustomValidator, ValidationChain } from "express-validator";
import User from "../models/user";
import {HttpError} from "../utils/types";
import { requiredMessage, stringMessage } from "./messages.helpers";

const existUsername: CustomValidator = async (username: string) => {
    const user = await User.findOne({username}).lean();
    if(user) {
        return Promise.reject();
    }
}

const passwordConfimation: CustomValidator = (confirmPassword, {req}) => {
    if(confirmPassword !== req.body.password) {
        throw new HttpError("Passwords don't match", 400);
    }
    return true;
}

const existEmail: CustomValidator = async (email: string) => {
    const user = await User.findOne({email}).lean();
    if(user) {
        return Promise.reject();
    } 
}

export function registerValidators(): ValidationChain[] {
    const username = body("username")
        .exists()
        .withMessage(requiredMessage("username"))
        .bail()
        .isString()
        .withMessage(stringMessage("username"))
        .bail()
        .custom(existUsername)
        .withMessage("username already exists");
    const firstName = body("firstName")
        .exists()
        .withMessage(requiredMessage("firstName"))
        .bail()
        .isString()
        .withMessage(stringMessage("firstName"))
        .isLength({min: 5, max: 10})
        .withMessage("[firstName] must be in between 5 and 10 characters long");
    const lastName = body("lastName")
        .exists()
        .withMessage(requiredMessage("lastName"))
        .bail()
        .isString()
        .withMessage(stringMessage("lastName"))
        .isLength({min: 5, max: 10})
        .withMessage("[lastName] must be in between 5 and 10 characters long");
    const email = body("email")
        .exists()
        .withMessage(requiredMessage("email"))
        .bail()
        .isEmail()
        .withMessage("[email] must be a valid email")
        .normalizeEmail()
        .bail()
        .custom(existEmail)
        .withMessage("email already in use");
    const password: ValidationChain = body("password")
        .exists()
        .withMessage(requiredMessage("password"))
        .bail()
        .isString()
        .withMessage(stringMessage("password"))
        .isLength({min: 8})
        .withMessage("[username] must be at least 8 characters long");
    const confirmPassword = body("confirmPassword")
        .exists()
        .withMessage(requiredMessage("confirmPassword"))
        .bail()
        .custom(passwordConfimation);
    const role = body("role")
        .exists()
        .withMessage(requiredMessage("role"))
        .bail()
        .isInt({min: 0, max: 2})
        .withMessage("[role] must be an integer between 0 and 2");
    return [username, firstName, lastName, email, password, confirmPassword, role];
}

export function loginValidators(): ValidationChain[] {
    const username = body("username")
        .exists()
        .withMessage(requiredMessage("username"))
        .bail()
        .isString()
        .withMessage(stringMessage("username"));
    const password = body("password")
        .exists()
        .withMessage(requiredMessage("password"))
        .bail()
        .isString()
        .withMessage(stringMessage("password"));
    return [username, password]
}