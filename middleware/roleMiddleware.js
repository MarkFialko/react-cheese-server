import TokenService from "../service/TokenService.js";
import {ApiError} from "../exceptions/ApiError.js";

export default (roles) => {
    return (req, res, next) => {
        const accessToken = (req.headers.authorization || '').replace(/Bearer\s?/, '')

        if (accessToken) {

            try {
                const {roles: userRoles} = TokenService.validateAccessToken(accessToken)
                let hasRole = false;

                userRoles.forEach(role => {
                    if (roles.includes(role)) {
                        hasRole = true
                    }
                })

                if (!hasRole) {
                    return res.status(403).json({
                        message: "Нет доступа"
                    })
                }

                next()

            } catch (err) {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }

        } else {
            return next(ApiError.UnauthorizedError())
        }
    }
}