import BasketModel from '../models/Basket.js'
import {ApiError} from "../exceptions/ApiError.js";
import IngredientService from "./IngredientService.js";
import BasketIngredientModel from "../models/BasketIngredient.js";
import IngredientModel from "../models/Ingredient.js";

class BasketService {

    add = async (userId, ingredientId) => {

        try {
            const basket = await BasketModel.findOne({userId})
            const ingredient = await IngredientService.getOne(ingredientId)

            if (!basket) {
                const basketDocument = new BasketModel({
                    userId
                })
                const basket = await basketDocument.save()
                const basketId = basket._id

                const basketIngredientDocument = new BasketIngredientModel({
                    basketId,
                    ingredientId
                })
                const basketIngredient = await basketIngredientDocument.save()
                const updatedBasket = await this.getAll(userId)

                return updatedBasket
            }

            const basketId = basket._id

            const basketIngredientDocument = new BasketIngredientModel({
                basketId,
                ingredientId
            })
            const basketIngredient = await basketIngredientDocument.save()
            const updatedBasket = await this.getAll(userId)

            return updatedBasket

        } catch (err) {
            throw ApiError.BadRequest(`Данного ингредиента нет`)
        }
    }


    remove = async (userId, ingredientId) => {

        try {
            const basket = await BasketModel.findOne({userId})
            const ingredient = await IngredientService.getOne(ingredientId)

            const basketId = basket._id

            const basketAndIngr = await BasketIngredientModel.find({basketId,ingredientId})

            for (const basketItem of Array.from(basketAndIngr)) {

                const ingredientId = basketItem.ingredientId
                const ingredient = await BasketIngredientModel.findOneAndDelete({basketId,ingredientId})

            }

            const basketIngredientsDocuments = await BasketIngredientModel.find({basketId})

            const basketToSend = new Map()
            const countIngredients = []

            for (const basketItem of Array.from(basketIngredientsDocuments)) {

                const ingredientId = basketItem.ingredientId
                const id = JSON.stringify(ingredientId)
                const ingredient = await IngredientModel.findOne({_id: ingredientId})
                if (!countIngredients[id]) {
                    countIngredients[id] = 0
                }
                countIngredients[id]++

                basketToSend.set(id, {ingredient, count: countIngredients[id]})

            }

            return Array.from(basketToSend.values())

        } catch (err) {
            throw ApiError.BadRequest(`Данного ингредиента нет`)
        }
    }

    getAll = async (userId) => {

        try {
            const basket = await BasketModel.findOne({userId})

            if (!basket) {
                throw ApiError.BadRequest('Нет козины')
            }

            const basketId = basket._id
            const basketIngredientsDocuments = await BasketIngredientModel.find({basketId})

            const basketToSend = new Map()
            const countIngredients = []

            for (const basketItem of Array.from(basketIngredientsDocuments)) {

                const ingredientId = basketItem.ingredientId
                const id = JSON.stringify(ingredientId)
                const ingredient = await IngredientModel.findOne({_id: ingredientId})
                if (!countIngredients[id]) {
                    countIngredients[id] = 0
                }
                countIngredients[id]++

                basketToSend.set(id, {ingredient, count: countIngredients[id]})

            }

            return Array.from(basketToSend.values())

        } catch (err) {
            throw ApiError.BadRequest(`Данного ингредиента нет`)
        }
    }


}

export default new BasketService()