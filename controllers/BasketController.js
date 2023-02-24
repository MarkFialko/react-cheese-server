import BasketService from "../service/BasketService.js";

export const addIngredient = async (req, res, next) => {
    try {
        const userId = req.user.id
        const ingredientId = req.params.id

        const basket = await BasketService.add(userId, ingredientId)
        res.json({basket})


    } catch (err) {
        next(err)
    }
}

export const removeIngredient = async (req, res, next) => {
    try {
        const userId = req.user.id
        const ingredientId = req.params.id

        const basket = await BasketService.remove(userId, ingredientId)
        res.json({basket})

    } catch (err) {
        next(err)
    }
}


export const getAll = async (req,res,next) => {
    try {
        const userId = req.user.id

        const basket = await BasketService.getAll(userId)
        res.json({basket})


    } catch (err) {
        next(err)
    }
}


