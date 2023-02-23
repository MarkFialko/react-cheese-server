import express from "express"
import multer from 'multer'
import mongoose from "mongoose"
import config from 'config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from "./router/authRouter.js";
import errorsMiddleware from "./middleware/errorsMiddleware.js";
import ingredientRouter from "./router/ingredientRouter.js";

const PORT = process.env.PORT || config.get("SERVER_PORT")
const DB_URL = process.env.DB_URL || config.get("DB_URL")
const CLIENT_URL = process.env.CLIENT_URL ||  config.get("CLIENT_URL")

const start = async () => {

    try {

        await mongoose.connect(DB_URL)
            .then(() => console.log("Database connected"))
            .catch((err) => console.log("Database connection error: ", err))

        await mongoose.connection.syncIndexes()

        const app = express()
        console.log(CLIENT_URL)
        app.use(express.json())
        app.use(cookieParser())
        app.use(cors({
            credentials: true,
            origin: CLIENT_URL
        }))

        const storage = multer.diskStorage({
            destination: (_,__,cb) => {
                cb(null,'uploads')
            },
            filename : (_,file,cb) => {
                cb(null,file.originalname)
            },

        })

        const upload = multer({storage})

        app.post('/upload', upload.single('image'), (req,res) => {
            res.json({
                url: `/uploads/${req.file.originalname}`
            })
        })

        app.use('/uploads', express.static('uploads'))

        app.use("/auth", authRouter)
        app.use('/ingredient', ingredientRouter)
        app.use(errorsMiddleware)

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

    } catch (e) {
    }
}

await start()