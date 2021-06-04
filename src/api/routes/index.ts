import {Router} from "express";
import RAuth from "./auth";
import RBooks from "./book";

const router = Router();

router.use("/auth", RAuth);
router.use("/book", RBooks);

export default router;