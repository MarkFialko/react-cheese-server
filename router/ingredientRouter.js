import {Router} from "express";
import * as IngredientController from "../controllers/IngredientController.js";

const router = new Router()

router.get("/", IngredientController.getAll)
router.post("/", IngredientController.create)

export default router