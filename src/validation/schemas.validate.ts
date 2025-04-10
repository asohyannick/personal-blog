import Joi, {  ObjectSchema }  from "@hapi/joi";
import { IPost } from "../interface/post/IPost.interface";
import { Types } from "mongoose";
import { IComment } from "../interface/comment/IComment.interface";
const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authRegister = Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


const authLogin = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const postSchema = Joi.object<IPost>({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    category: Joi.string().required(),
    isPublishable: Joi.boolean().required(),
    views: Joi.number().integer().min(0).required(),
    imageURL: Joi.string().uri().optional(), // Assuming imageURL is optional
    excerpt: Joi.string().optional(),
    readingTiime: Joi.number().integer().min(0).optional(),
    date: Joi.date().required(),
});

const commentSchema = Joi.object<IComment>({
    postId: Joi.string().custom((value, helper) => {
        if (!Types.ObjectId.isValid(value)) {
            return helper.error('Invalid postId format');
        }
        return value;
    }).required(),
    author: Joi.string().required(),
    content: Joi.string().required(),
    isApproved: Joi.boolean().required(),
    date: Joi.date().required(),
});

export default {
    "/auth/create-account": authRegister,
    "/auth/login": authLogin,
    "/post/create-post": postSchema,
    "/comment/create-comment": commentSchema
} as { [key: string]: ObjectSchema }
