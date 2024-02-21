import { config } from 'dotenv';
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'
config("dotenv")

mongoose.connect(process.env.DATABASE_URL)
    .then(() => { console.log('connection successfull'); }).catch((e) => console.log(e))

const app = express();
app.use(express.json())
app.use(cookieParser())
app.listen(3000, () => {
    console.log("Server is up and running")
})
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "INTernal server error"
    res.status(statusCode).json({
        success: false,
        statusCode, message
    })
})