const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware
]

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('category required')
    .isLength({min:3}).withMessage('too short category')
    .isLength({max:32}).withMessage('too long category'),
    validatorMiddleware
]
exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware
]
