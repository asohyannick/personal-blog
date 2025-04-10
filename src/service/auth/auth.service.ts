import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Auth from "../../model/auth/auth.model";
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
        const accessToken = jwt.sign({id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin},
            process.env.JWT_SECRET_KEY as string , { expiresIn: '15m'})
        const refreshToken = jwt.sign({id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin},
            process.env.JWT_SECRET_KEY as string, {expiresIn: '7d'})
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.cookie('auth', refreshToken, {
            secure: process.env.NODE_ENV as string === 'production',
            maxAge: 90000,
            sameSite: 'strict',
            httpOnly: true,
        });
        return res.status(StatusCodes.CREATED).json({
            message: "User has been created successfully",
            success: true,
            newUser,
            accessToken,
            refreshToken,
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
        return res.status(StatusCodes.OK).json({
            success:  true,
            message: "User has been logged in successfully",
            id: user._id,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid Refresh Token" });
    }    
    try {
        // Verify the refresh token
        const userPayload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        // Check if exp exists
        if (!userPayload.exp) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }

        // Find the user by ID
        const user = await Auth.findById(userPayload.user);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }

        // Check if the stored refresh token matches
        if (user.refreshToken !== refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }

        // Check if the refresh token has expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (userPayload.exp < currentTime) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token has expired" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '15m' }
        );

        return res.status(StatusCodes.OK).json({
            message: "New access token has been retrieved successfully.",
            newAccessToken
        });
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Something went wrong.", error});
    }
};

const fetchUsers = async(req: Request, res: Response): Promise<Response> => {
    try {
        const users = await Auth.find();
        return res.status(StatusCodes.OK).json({message: "Users have been fetched successfully", users});
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

const fetchUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist"
            });
        }
        return res.status(StatusCodes.OK).json({message: "User has been fetched successfully", user});
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

const updateUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findByIdAndUpdate(id, req.body, {new: true});
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist"
            });
        }
        return res.status(StatusCodes.OK).json({message: "User has been updated successfully", user});
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

const deleteUser = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const user = await Auth.findByIdAndDelete(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User does not exist"
            });
        }
        return res.status(StatusCodes.OK).json({message: "User has been deleted successfully", user});
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Something went wrong."});
    }
};

export {
    register,
    login,
    refreshAccessToken,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser
}
