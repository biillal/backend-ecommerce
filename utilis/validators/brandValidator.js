const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Category id'),
    validatorMiddleware
]

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand required')
    .isLength({min:3}).withMessage('too short Brand')
    .isLength({max:32}).withMessage('too long Brand'),
    validatorMiddleware
]
exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id'),
    validatorMiddleware
]
exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id'),
    validatorMiddleware
]
