const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const apiError = require('../utilis/apiError');
const path = require('path');
const fs = require('fs')
const { cloudinarayUploadImage } = require('../utilis/cloudinary');
const Brand = require('../models/brands');
module.exports.createBrand = asyncHandler(async (req, res) => {
    const name = req.body.name
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinarayUploadImage(imagePath)
    const brand = await Brand.create({
        name,
        slug: slugify(name),
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }
    })
    res.status(201).json({ data: brand })
    fs.unlinkSync(imagePath)
})

module.exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    const brands = await Brand.find({}).skip(skip).limit(limit)
    res.status(201).json({ results: brands.length, page: page, data: brands })
})

module.exports.getSingleBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const brand = await Brand.findById(id)
    if (!brand) {
        //res.status(404).json({ message: `no brand for this id ${id}` })
        return next(new apiError(`no brand for this id ${id}`, 404))
    }
    res.status(201).json(brand)
})



module.exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const brand = await Brand.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name)
        }
        , { new: true })
    if (!brand) {
        //res.status(404).json({ message: `no brand for this id ${id}` })
        return next(new apiError(`no brand for this id ${id}`, 404))
    }
    res.status(201).json(brand)
})



module.exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const brand = await Brand.findByIdAndDelete(id)
    if (!brand) {
        //res.status(404).json({ message: `no brand for this id ${id}` })
        return next(new apiError(`no brand for this id ${id}`, 404))
    }
    res.status(201).json({ message: 'brand deleted' })
})