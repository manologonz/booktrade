import { body, CustomValidator, ValidationChain } from "express-validator";
import User from "../models/user";
import {HttpError} from "../utils/types";
import {
    requiredMessage,
    stringMessage,
    arrayMessage,
    intMessage,
    floatMessage,
    dateMessage,
    emptyStringMessage,
    emptyArrayMessage,
    notCeroMessage
} from "./messages.helpers";

const minimumPages:CustomValidator = (pages) => {
    if(pages < 100) {
        return false;
    }
    return true;
}

const notCero:CustomValidator = (number) => {
    if(number === 0) {
        return false;
    }
    return true;
}


export function createBookValidators(): ValidationChain[] {
    const title = body("title")
        .exists()
        .withMessage(requiredMessage("title"))
        .bail()
        .isString()
        .withMessage(stringMessage("title"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));
    const subtitle = body("subtitle")
        .optional()
        .bail()
        .isString()
        .withMessage(requiredMessage("subtitle"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));
    const author = body("author")
        .exists()
        .withMessage(requiredMessage("author"))
        .bail()
        .isArray()
        .withMessage(arrayMessage("author"))
        .notEmpty()
        .withMessage(emptyArrayMessage("author"));
    const authorChild = body("author.*")
        .exists()
        .withMessage(requiredMessage("authorChild"))
        .bail()
        .isString()
        .withMessage(stringMessage("authorChild"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));
    const publisher = body("publisher")
        .exists()
        .withMessage(requiredMessage("publisher"))
        .bail()
        .isString()
        .withMessage(stringMessage("publisher"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));
    const pages = body("pages")
        .exists()
        .withMessage(requiredMessage("pages"))
        .bail()
        .isInt()
        .withMessage(intMessage("pages"))
        .custom(minimumPages)
        .withMessage("A book must have at least one hundred (100) pages");
    const price = body("price")
        .exists()
        .withMessage(requiredMessage("price"))
        .bail()
        .isFloat()
        .withMessage(floatMessage("price"))
        .notEmpty();
    const lenguage = body("lenguage")
        .exists()
        .withMessage(requiredMessage("lenguage"))
        .bail()
        .isString()
        .withMessage(stringMessage("lenguage"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));;
    const published = body("published")
        .exists()
        .withMessage(requiredMessage("published"))
        .bail()
        .isDate()
        .withMessage(dateMessage("publshed"));
    const category = body("category")
        .exists()
        .withMessage(requiredMessage("category"))
        .bail()
        .isString()
        .withMessage(stringMessage("category"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));;
    const isbn = body("isbn")
        .exists()
        .withMessage(requiredMessage("isbn"))
        .bail()
        .isString()
        .withMessage(stringMessage("isbn"))
        .bail()
        .notEmpty()
        .withMessage(emptyStringMessage("title"));
    const quantity = body("quantity")
        .exists()
        .withMessage(requiredMessage("quantity"))
        .bail()
        .isInt()
        .withMessage(intMessage("quantity"))
        .bail()
        .custom(notCero)
        .withMessage(notCeroMessage("quantity"));
    const description = body("description")
        .exists()
        .withMessage(requiredMessage("description"))
        .bail()
        .isString()
        .withMessage(stringMessage("description"));

    return [
        title,
        subtitle,
        author,
        authorChild,
        publisher,
        pages,
        price,
        lenguage,
        published,
        category,
        isbn,
        quantity,
        description,
    ];
}