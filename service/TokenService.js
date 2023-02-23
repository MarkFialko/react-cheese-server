import jwt from "jsonwebtoken";
import TokenModel from "../models/Token.js";
import config from "config";

class TokenService {

    generateTokens = (payload) => {
        const accessToken = jwt.sign(payload, config.get("JWT_ACCESS_SECRET"), {expiresIn: '10h'})
        const refreshToken = jwt.sign(payload, config.get("JWT_REFRESH_SECRET"), {expiresIn: '60d'});

        return {accessToken, refreshToken}
    }

    saveToken = async (userId, refreshToken) => {
        const tokenData = await TokenModel.findOne({user: userId})

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await new TokenModel({
            user: userId,
            refreshToken
        })

        return token.save()

    }

    removeToken = async (refreshToken) => {
        const token = await TokenModel.deleteOne({refreshToken})
        return token
    }

    validateAccessToken = (accessToken) => {
        try {
            const userData = jwt.verify(accessToken, config.get("JWT_ACCESS_SECRET"));

            return userData

        } catch (e) {
            return null
        }
    }

    validateRefreshToken = (refreshToken) => {
        try {

            const userData = jwt.verify(refreshToken, config.get("JWT_REFRESH_SECRET"));

            return userData

        } catch (e) {
            return null
        }
    }


    findToken = async (refreshToken) => {
        const tokenData = await TokenModel.findOne({refreshToken})

        return tokenData
    }

}

export default new TokenService()