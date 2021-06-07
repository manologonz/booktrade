import {Router} from "express";
import {listUsers} from "../controllers/user";

const router = Router();

router.get("/", listUsers);

export default router;