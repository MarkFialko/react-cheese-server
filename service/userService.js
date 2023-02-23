import UserModel from "../models/User.js"
import bcrypt from "bcrypt";
import {v4} from "uuid";
import Role from "../models/Role.js";
import MailService from "./MailService.js";
import UserDto from "../dtos/UserDto.js";
import TokenService from "./TokenService.js";
import config from "config";
import {ApiError} from "../exceptions/ApiError.js";
import AddressModel from "../models/Address.js";

class UserService {
    registration = async (email, password, fullName) => {

        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }

        const salt = await bcrypt.genSalt(4);
        const passwordHash = await bcrypt.hash(password, salt);

        const activationLink = v4()

        const addressDocument = new AddressModel()
        const address = await addressDocument.save()

        const userDocument = new UserModel({
            email,
            fullName,
            passwordHash,
            activationLink,
            roles: [new Role().value],
            address: address._id
        })

        const user = await userDocument.save();

        const userWithAddress = await UserModel.findOne({_id: user._id}).populate("address")

        await MailService.sendActivationMail(email, config.get("API_URL") + "/auth/activate/" + activationLink)

        const userDto = new UserDto(userWithAddress)

        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }

    }

    login = async (email, password) => {
        const user = await UserModel.findOne({email}).populate("address")

        if (!user) {
            throw ApiError.BadRequest("Пользователь не был найден")
        }

        const isPassEquals = await bcrypt.compare(password, user.passwordHash)

        if (!isPassEquals) {
            throw  ApiError.BadRequest("Неверный пароль")
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }

    }

    logout = async (refreshToken) => {

        const token = await TokenService.removeToken(refreshToken);
        return token;

    }

    activate = async (activationLink) => {
        const user = await UserModel.findOne({activationLink})

        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активациия')
        }

        user.isActivated = true;

        await user.save()
    }

    refresh = async (refreshToken) => {

        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromBd = await TokenService.findToken(refreshToken)


        if (!userData || !tokenFromBd) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id).populate("address")

        const userDto = new UserDto(user)

        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }

    }

    update = async (userId, phone, street, country, region, city) => {

        const updateAddress = [{'street': street}, {'country': country}, {'region': region}, {'city': city}]
            .reduce((acc, cur) => {

                const key = Object.keys(cur)[0]

                if (!!cur[key]) acc[key] = cur[key]
                return acc
            }
            , {})


        const user = await UserModel.findOne({_id: userId})
        const address = await AddressModel.findOneAndUpdate(
            {_id: user.address},
            updateAddress,
            {new: true}
        )

        const updatedUser = await UserModel.findOneAndUpdate({_id: userId},
            {phone: phone ? phone : user.phone},
            {new: true}).populate('address')

        const userDto = new UserDto(updatedUser)

        return {
            user: userDto
        }

    }

    getMe = async (userId) => {

        const user = await UserModel.findOne({_id: userId}).populate('address')
        const userDto = new UserDto(user)
        return {
            user: userDto
        }

    }

}

export default new UserService()