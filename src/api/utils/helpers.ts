import {Request, Response, NextFunction} from "express";
import {Result} from "express-validator";
import {HttpError} from "../utils/types";
import {FieldErrors} from "./types";
import {isValidObjectId} from "mongoose";
import {Client} from "@elastic/elasticsearch";

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



export class ObjectIdValidator {

    single(id: any) {
        if(!isValidObjectId(id) || !id) {
            throw new HttpError("Invalid ID", 400);
        }
    }

    many(ids: any[]) {
        ids.forEach((id) => {
            if(!isValidObjectId(id) || !id) {
                throw new HttpError("Invalid ID", 400);
            }
        });
    }
}

export const esClient = new Client({node: "http://localhost:9200"});

export async function createElasticBookIndex() {
    try {
      await esClient.indices.create({
        index: "book",
        body: {
          mappings: {
            properties: {
              title: {
                type: "completion"
              }
            }
          }
        }
      });
    } catch(error) {
      console.log(error)
      if(error.statusCode === 400) {
        console.log("index already created");
      } else {
        console.log(error);
      }
    }
}
