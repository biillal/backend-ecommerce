const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require('slugify');
const { User } = require("../../model/user");
const bcrypt = require('bcrypt');
const Category = require("../../model/category");

exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid User id'),
    validatorMiddleware
]

exports.createProductValidator = [
    check('name')
        .notEmpty()
        .withMessage('name is required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        })
    ,
    check('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 15 })
        .withMessage('description must be at least 15 characters'),
    check('quantity')
        .notEmpty()
        .withMessage('quantity product is required')
        .isNumeric()
        .withMessage('product quantity must be a number'),
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('product sold must be a number'),
    check('price')
        .notEmpty()
        .withMessage('price is required')
        .isLength({ max: 32 })
        .withMessage('price must be at least 200000 chiffre')
        .isNumeric()
        .withMessage('product price must be a number'),
    check('priceAfterDiscount')
        .optional()
        .isFloat()
        .isNumeric()
        .withMessage('product quantity must be a number')
        .custom((val, { req }) => {
            if (req.body.price <= val) {
                throw new Error('priceAfterDiscount must be lower then price')
            }
            return true
        }),
    check('colors')
        .optional(),
    check('image')
        .optional(),
    check('images')
        .optional(),
    check('category')
        .notEmpty()
        .withMessage('category Product is required')
        .isMongoId()
        .withMessage('invalid category Id')
        .custom(async id => {
            const category = await Category.findById(id);
            if (!category) {
                throw new Error('no category id in the database');
            }
        }),
    check('subCategory')
        .optional()
        .isMongoId()
        .withMessage('invalid category Id'),
    check('brand')
        .optional()
        .isMongoId()
        .withMessage('invalid category Id'),
    validatorMiddleware
]
exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid product id'),
    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid product id'),
    validatorMiddleware
]

