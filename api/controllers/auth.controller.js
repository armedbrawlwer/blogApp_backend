import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return next(errorHandler(400, 'all field required'))
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({
            username,
            password: hashedPassword, email
        })
        const useradd = await newUser.save();
        return res.status(201).json([
            useradd
        ])
    }
    catch (e) {
        next(e)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(errorHandler(400, "all fields are required "))
    }

    try {
        const validuser = await User.findOne({ email })
        if (!validuser) {
            next(errorHandler(404, "not a valid user"))
        }

        const validpwd = bcryptjs.compareSync(password, validuser.password)
        if (!validpwd) {
            return next(errorHandler(400, 'invalid passwod'))
        }
        const token = jwt.sign({
            id: validuser._id,
            isAdmin : validuser.isAdmin
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        res.status(200).cookie('access_token',
            token, { httpOnly: true }).json({
                validuser,
                message: "Successfull signin"
            })
    }
    catch (e) {
        console.log(e)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id ,isAdmin:user.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });

            // Save the new user to the database
            const savedUser = await newUser.save();

            // Now, use the saved user to sign the token
            const token = jwt.sign({ id: savedUser._id ,
            isAdmin:savedUser.isAdmin}, process.env.JWT_SECRET);
            const { password: savedUserPassword, ...savedUserRest } = savedUser._doc;

            return res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(savedUserRest);
        }
    } catch (e) {
        next(e);
    }
};
