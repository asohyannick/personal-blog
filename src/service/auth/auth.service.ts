import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Auth from "../../model/auth/auth.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const register = async(req: Request, res:Response): Promise<Response> => {
    const { username, password} = req.body;
    try {
        let user = await Auth.findOne({ username });
        if (user) {
            user.refreshToken = '' // cancel existing refresh token
            user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({message: "User already exist!"});
        }
        const newUser = new Auth({
            username,
            password,
            isAdmin: true
        });
        await newUser.save();
        const accessToken = jwt.sign({id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET_KEY as string , { expiresIn: '15m'})
        const refreshToken = jwt.sign({id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET_KEY as string, {expiresIn: '7d'})
        res.cookie('auth', refreshToken, {
            secure: process.env.NODE_ENV as string === 'production',
            maxAge: 90000,
            sameSite: 'strict',
            httpOnly: true,
        });
        return res.status(StatusCodes.CREATED).json({
            message: "User has been created successfully",
            success: true,
            accessToken,
            refreshToken,
            newUser
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

const login = async(req:Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    try {
        let user = await Auth.findOne({username, isAdmin: true});
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"});
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Credentials"});
        }
        const accessToken = jwt.sign({user: user._id, username: user.username, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY as string, {expiresIn: '15m'});
        const refreshToken = jwt.sign({user: user._id, username: user.username, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY as string, {expiresIn: '7d'});
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('auth', refreshToken, {
            httpOnly: true,
            maxAge: 900000,
            secure: process.env.NODE_ENV as string === 'production',
            sameSite: 'strict'
        });
        console.log('Cookies after setting:', req.cookies);
        return res.status(StatusCodes.OK).json({
            success:  true,
            message: "User has been logged in successfully",
            accessToken,
            refreshToken,
            user
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

export {
    register,
    login
}
