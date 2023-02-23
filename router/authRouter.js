import {Router} from "express";
import * as UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {loginValidation} from "../validations/User/login.js";
import {registerValidation} from "../validations/User/register.js";
import {updateValidation} from "../validations/User/update.js";

const router = new Router()

router.post("/login", loginValidation, UserController.login)
router.post("/registration", registerValidation, UserController.registration)
router.post("/logout", UserController.logout)
router.post('/me', authMiddleware, updateValidation, UserController.update)
router.get("/activate/:link", UserController.activate)
router.get("/refresh", UserController.refresh)
router.get("/me", authMiddleware, UserController.getMe)

export default router