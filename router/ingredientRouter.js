import {Router} from "express";
import * as IngredientController from "../controllers/IngredientController.js";

const router = new Router()

router.get("/", IngredientController.getAll)
router.post("/", IngredientController.create)
router.get("/:id", IngredientController.getOne)

export default router