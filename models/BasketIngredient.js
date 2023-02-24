import mongoose, {Schema} from "mongoose"

const BasketIngredientSchema = new mongoose.Schema({
        basketId: {type: Schema.Types.ObjectId, ref: 'Basket',},
        ingredientId: {type: Schema.Types.ObjectId, ref: 'Ingredient'},
    }
)

export default mongoose.model('BasketIngredient', BasketIngredientSchema)