import {Result} from "express-validator";
import {HttpError} from "../utils/types";
import {FieldErrors} from "./types";

export function checkErrors(result: Result) {
    if(!result.isEmpty()) {
        const errors: FieldErrors = {};
        result.array().forEach(({param, msg}) => {
            if(errors.hasOwnProperty(param)) {
                errors[param] = [
                    ...errors[param],
                    msg
                ]
            } else {
                errors[param] = [msg];
            }
        });
        throw new HttpError("Validation error", 400, true, errors);
    }
}

