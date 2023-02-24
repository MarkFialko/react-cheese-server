import mongoose, {Schema} from "mongoose"

const BasketSchema = new mongoose.Schema({
        userId: {type: Schema.Types.ObjectId, ref: "User"}
    }
)

export default mongoose.model('Basket', BasketSchema)