import {ILeanUser} from "../../src/api/models/types";

declare global {
    namespace Express {
        interface Request {
            user: ILeanUser | null;
        }
    }
}