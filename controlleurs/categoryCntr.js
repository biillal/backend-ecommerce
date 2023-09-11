const asyncHandler = require('express-async-handler')
const { Category } = require('../models/category')
const { cloudinarayUploadImage } = require('../utilis/cloudinary');
const apiError = require('../utilis/apiError');
const slugify = require('slugify')
const path = require('path');
const fs = require('fs')

module.exports.createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinarayUploadImage(imagePath)
    const category = await Category.create({
        name,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }
    })
    res.status(201).json({ data: category })
    fs.unlinkSync(imagePath)
})

module.exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    const categories = await Category.find({}).skip(skip).limit(limit)
    res.status(201).json({ results: categories.length, page: page, data: categories })
})

module.exports.getSingleCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const category = await Category.findById(id)
    if (!category) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no category for this id ${id}`, 404))
    }
    res.status(201).json(category)
})



module.exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const category = await Category.findOneAndUpdate(
        { _id: id },
        {
            name
        }, { new: true })
    if (!category) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no category for this id ${id}`, 404))
    }
    res.status(201).json(category)
})



module.exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const category = await Category.findByIdAndDelete(id)
    if (!category) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no category for this id ${id}`, 404))
    }
    res.status(201).json({ message: 'category deleted' })
})