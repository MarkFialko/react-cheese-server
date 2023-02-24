import IngredientService from "../service/IngredientService.js";

export const getAll = async (req, res, next) => {

    try {

        const ingredients = await IngredientService.getAll()

        res.json(ingredients)

    } catch (err) {
        next(err)
    }

}

export const create = async (req, res, next) => {

    try {

        const {title,price, imageUrl} = req.body
        const ingredients = await IngredientService.create(title,price,imageUrl)

        res.json(ingredients)

    } catch (err) {
        next(err)
    }

}

export const getOne = async (req,res,next) => {
    try {

        const id = req.params.id
        const ingredient = await IngredientService.getOne(id)

        res.json(ingredient)

    } catch (err) {
        next(err)
    }
}



