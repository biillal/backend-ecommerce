const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require('slugify');
const { User } = require("../../models/user");
const bcrypt = require('bcrypt')

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'),
    validatorMiddleware
]

exports.createUserValidator = [
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
    check('phone')
        .optional()
        .isMobilePhone("ar-DZ")
        .withMessage('invalid phone number only accepted DZ'),
    check('image')
        .optional(),
    check('role')
        .optional(),
    validatorMiddleware
]
exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'),
    check('username')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        })
    ,
    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
    check('phone')
        .optional()
        .isMobilePhone("ar-DZ")
        .withMessage('invalid phone number only accepted DZ'),
    check('image')
        .optional(),
    check('role')
        .optional(),
    validatorMiddleware
]
exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'),
    body('currentPassword')
        .notEmpty()
        .withMessage('You must entrer your current password'),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must entrer your current password confirmation'),
    body('password')
        .notEmpty()
        .withMessage('You must entrer new password')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.params.id)
            if (!user) {
                throw new Error('There is no user for this id')
            }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password)
            if (!isCorrectPassword) {
                throw new Error('Incorrect current password')
            }
            if (val != req.body.passwordConfirm) {
                throw new Error('Password confirmation incorrect')
            }
            return true
        }),
    validatorMiddleware

]
exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'),
    validatorMiddleware
]

exports.addLikeProductValidator = [
    body('productId')
        .notEmpty()
        .withMessage("productId is required"),
    validatorMiddleware
]
exports.getLikeProductValidator = [
    check('id').isMongoId().withMessage('Invalid cczz User id'),

    validatorMiddleware
]
exports.validateEmail = [
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email address'),
    validatorMiddleware
]
exports.validateNewPassword = [
    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
    validatorMiddleware
]