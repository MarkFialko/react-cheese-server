import {ApiError} from "../exceptions/ApiError.js";
import TokenService from "../service/TokenService.js";

export default (req, res, next) => {
    try {
        const accessToken = (req.headers.authorization).replace(/Bearer\s?/, '')
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()

    } catch (err) {
        return next(ApiError.UnauthorizedError())
    }
}