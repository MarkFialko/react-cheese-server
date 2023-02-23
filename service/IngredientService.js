import IngredientModel from '../models/Ingredient.js'

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

}

export default new IngredientService()