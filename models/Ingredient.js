import mongoose, {Schema} from "mongoose"

const IngredientSchema = new mongoose.Schema({
        title: {type: String, required: true,},
        imageUrl: {type: String, required: true},
        price: {type: Number, required: true},
    }
)

export default mongoose.model('Ingredient', IngredientSchema)