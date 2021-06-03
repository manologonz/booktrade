import {Router} from "express";
import RAuth from "./auth";

const router = Router();

router.use("/auth", RAuth);

export default router;