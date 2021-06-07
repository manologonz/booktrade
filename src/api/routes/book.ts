import {Router} from "express";
import {listBooks, createBook, updateBook, deleteBook} from "../controllers/book";
import {isAuthenticated, isBookSeller} from "../permissions";
import {createBookValidators} from "../validators/book";
const updatePerms = [isAuthenticated, isBookSeller]

const router = Router();

router.get("/", listBooks);
router.post("/", createBookValidators(), isAuthenticated, createBook);
router.put("/:bookId", createBookValidators(), updatePerms, updateBook);
router.delete("/:bookId", updatePerms, deleteBook);
export default router;
