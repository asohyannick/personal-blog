import Joi, {  ObjectSchema }  from "@hapi/joi";
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

export default {
    "/auth/create-account": authRegister,
    "/auth/login": authLogin,
} as { [key: string]: ObjectSchema }
