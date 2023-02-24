import IngredientModel from '../models/Ingredient.js'
import {ApiError} from "../exceptions/ApiError.js";

class IngredientService {

    getAll = async () => {

        const ingredients = await IngredientModel.find({})

        return {
            ingredients
        }

    }

    create = async (title, price, imageUrl) => {
        const ingredient = new IngredientModel({
            title,
            price,
            imageUrl
        })

        await ingredient.save()

        return {
            ingredient
        }
    }

    getOne = async (id) => {

        try {
            const ingredient = await IngredientModel.findOne({_id: id})

            return {
                ingredient
            }

        } catch (err) {
            throw ApiError.BadRequest(`Данного ингредиента нет`)
        }
    }

}

export default new IngredientService()