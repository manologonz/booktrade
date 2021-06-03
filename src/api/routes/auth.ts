import {Router} from "express";
import {registerValidators, loginValidators} from "../validators/user";
import {register, login} from "../controllers/auth";

const router: Router = Router();


router.post("/register", registerValidators(), register);
router.post("/login", loginValidators(), login);

export default router;