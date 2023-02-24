import {Router} from "express";
import * as BasketController from "../controllers/BasketController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router()

router.post("/:id", authMiddleware, BasketController.addIngredient)
router.delete("/:id", authMiddleware, BasketController.removeIngredient)
router.get("/", authMiddleware, BasketController.getAll)

export default router