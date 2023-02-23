import {check} from "express-validator";

export const updateValidation = [
    check('phone', 'Неверный формат телефона')
        .optional()
        .matches(/\+7-\([0-9]{3}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}/),
]



