import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import mongoose from "mongoose";

export const updateUser = async (req, res, next) => {
    console.log(req.user)
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(402, 'not allowed to update another user'))
    }
    //modifying the password
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'choose a longer passwrod'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    //modifying the username
    if (req.body.username) {
        if (req.body.username.includes('')) {
            return next(errorHandler(400, 'no spaces allowed in username'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'all letters in username must be in lowercase'))
        }
        if (!req.body.username.match(/^[a-zA-z0-9]+$/)) {
            return next(errorHandler(400, 'username must contain letters and numbers'))
        }
    }
    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password
                }
            }, { new: true })
        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json(rest)

    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating user",
        })
    }

}
export const deleteUser = async (req, res, next) => {
    console.log(req.user);
    console.log(req.params.userId); // Corrected to use req.params.userId

    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'not allowed to delete another user'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        return res.status(200).json(
            {
                success: true,
                message: "user deleted successfully"
            }
        )
    } catch (e) {
        next(e)
    }
}


export const signout = async (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json('user has been signed out')
    }
    catch (e) {
        next(e)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(500, 'not allowed to view details'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const Users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
        const usersWithoutPwd = Users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments(
            {
                createdAt: { $gte: oneMonthAgo }
            }
        )

        const totalUsers = await User.countDocuments()

        return res.status(200).json({
            success: true,
            users: usersWithoutPwd,
            lastMonthUsers,
            totalUsers
        })

    }
    catch (e) {
        next(errorHandler(500, e.message))
    }
}

export const getUser = async (req, res, next) => {
    try {
        // const userId = 
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "No user found for this id"
            })
        }
        const { password, ...rest } = user._doc
        return res.status(200).json(rest);
    }
    catch (e) {
        next(errorHandler(500, e.message))
    }
}

