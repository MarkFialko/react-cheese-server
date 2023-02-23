import mongoose, {Schema} from "mongoose"

const UserSchema = new mongoose.Schema({
        fullName: {type: String, required: true,},
        isActivated: {type: Boolean, default: false},
        activationLink: {String, default: false},
        email: {type: String, unique: true, required: true},
        passwordHash: {type: String},
        avatarUrl: {type: String, default: ''},
        roles: [{type: String, ref: "Role"}],
        phone: {type: String, default: ''},
        address : {type: Schema.Types.ObjectId, ref: 'Address', required:true}
    }
)

export default mongoose.model('User', UserSchema)