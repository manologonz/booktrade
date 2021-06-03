import { body, CustomValidator, ValidationChain } from "express-validator";
import User from "../models/user";
import {HttpError} from "../utils/types";

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
        .bail()
        .withMessage("[username] is a required field")
        .isString()
        .withMessage("[username] must be string")
        .bail()
        .custom(existUsername)
        .withMessage("username already exists");
    const firstName = body("firstName")
        .exists()
        .withMessage("[firstName] is a required field")
        .bail()
        .isString()
        .withMessage("[firstName] must be string")
        .isLength({min: 5, max: 10})
        .withMessage("[firstName] must be in between 5 and 10 characters long");
    const lastName = body("lastName")
        .exists()
        .withMessage("[lastName] is a required field")
        .bail()
        .isString()
        .withMessage("[lastName] must be string")
        .isLength({min: 5, max: 10})
        .withMessage("[lastName] must be in between 5 and 10 characters long");
    const email = body("email")
        .exists()
        .withMessage("[email] is a required field")
        .bail()
        .isEmail()
        .withMessage("[email] must be a valid email")
        .normalizeEmail()
        .bail()
        .custom(existEmail)
        .withMessage("email already in use");
    const password: ValidationChain = body("password")
        .exists()
        .withMessage("[password] is a required field")
        .bail()
        .isString()
        .withMessage("[username] must be string")
        .isLength({min: 8})
        .withMessage("[username] must be at least 8 characters long");
    const confirmPassword = body("confirmPassword")
        .exists()
        .withMessage("[confirmPassword] is a required field")
        .bail()
        .custom(passwordConfimation);
    return [username, firstName, lastName, email, password, confirmPassword];
}

export function loginValidators(): ValidationChain[] {
    const username = body("username")
        .exists()
        .withMessage("[username] is a required field")
        .bail()
        .isString()
        .withMessage("[username] must be string");
    const password = body("password")
        .exists()
        .withMessage("[password] must be a required field")
        .bail()
        .isString()
        .withMessage("[password] must be string");
    return [username, password]
}