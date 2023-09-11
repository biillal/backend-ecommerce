const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require('slugify');
const { User } = require("../../models/user");
const bcrypt = require('bcrypt')



exports.signupValidator = [
    check('username')
        .notEmpty()
        .withMessage('username is required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        })
    ,
    check('email')
        .notEmpty()
        .withMessage('username is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password != req.body.passwordConfirm) {
                throw new Error('Password confirmation incorrect')
            }
            return true
        }),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('password confirmation is required'),
    validatorMiddleware
]
exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('username is required')
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .notEmpty()
        .withMessage('password is required'),
    validatorMiddleware
]

