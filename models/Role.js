import mongoose from "mongoose"

const RoleSchema = new mongoose.Schema({
    value: {type: String, unique: true, default: "User"}
})


export default mongoose.model("Role",RoleSchema)