import {Router} from "express";
import RAuth from "./auth";
import RBooks from "./book";
import RUser from "./user";

const router = Router();

router.use("/auth", RAuth);
router.use("/book", RBooks);
router.use("/user", RUser);

export default router;