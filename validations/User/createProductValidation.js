import {body} from "express-validator";

export const createProductValidation = [
    body('title', 'Неверный формат почты').isLength({min: 15}),
    body('price', 'Цена должны быть числом').isInt(),
]