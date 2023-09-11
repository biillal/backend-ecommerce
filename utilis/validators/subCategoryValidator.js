const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id'),
    validatorMiddleware
]

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('subCategory required')
        .isLength({ min: 3 }).withMessage('too short subCategory')
        .isLength({ max: 32 }).withMessage('too long subCategory'),
    check('category').notEmpty().withMessage('category required'),
    validatorMiddleware
]
exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id'),
    validatorMiddleware
]
exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subCategory id'),
    validatorMiddleware
]
