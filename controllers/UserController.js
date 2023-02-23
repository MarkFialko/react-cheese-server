import UserService from "../service/userService.js";
import config from "config";
import {validationResult} from "express-validator";
import {ApiError} from "../exceptions/ApiError.js";

export const registration = async (req, res, next) => {

    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
        }

        const {email, password, fullName} = req.body

        const userData = await UserService.registration(email, password, fullName)

        res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

        res.json(userData)

    } catch (err) {
        next(err)
    }

}

export const login = async (req, res, next) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Неправильное имя пользователя или пароль", errors.array()))
        }

        const {email, password} = req.body;


        const userData = await UserService.login(email, password)

        res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        console.log("сохранили токен в куки")
        res.json(userData)

    } catch (err) {
        next(err)
    }
}

export const getMe = async (req, res, next) => {
    try {
        console.log(req.user)
        const userId = req.user.id
        const {user, address} = await UserService.getMe(userId)
        res.json({
            user,
            address
        })


    } catch (err) {
        next(err)
    }

}

export const update = async (req, res, next) => {

    try {
        /* todo
            1. Валидация только пришедших значений
         */
        /*const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Неккорректные данные", errors.array()))
        }*/

        const {phone, street, country, region, city} = req.body

        const userId = req.user.id
        const userData = await UserService.update(userId, phone, street, country, region, city)
        res.json(
            userData
        )


    } catch (err) {
        next(err)
    }
}

export const logout = async (req, res, next) => {
    try {

        const {refreshToken} = req.cookies;

        const token = await UserService.logout(refreshToken)

        res.clearCookie("refreshToken ")

        return res.json(token)
    } catch (err) {
        next(err)
    }

}

export const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link

        await UserService.activate(activationLink)

        return res.redirect(config.get("CLIENT_URL"))

    } catch (err) {
        next(err)
    }

}


export const refresh = async (req, res, next) => {
    try {

        const {refreshToken} = req.cookies;

        const userData = await UserService.refresh(refreshToken)

        res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        console.log("сохранили токен в куки")
        res.json(userData)

    } catch (err) {
        next(err)
    }
}