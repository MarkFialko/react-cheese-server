import mongoose from "mongoose"

const AddressSchema = new mongoose.Schema({
        country: {type: String, default: "Российская Федерация"},
        city: {type: String, default: "Москва"},
        street: {type: String, default: ""}
    }
)

export default mongoose.model('Address', AddressSchema)