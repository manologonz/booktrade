import {Router} from "express";
import {listBooks, createBook} from "../controllers/book";
import {isAuthenticated} from "../permissions";
import {createBookValidators} from "../validators/book";

const router = Router();

router.get("/", listBooks);
router.post("/", createBookValidators(), isAuthenticated, createBook);
export default router;
