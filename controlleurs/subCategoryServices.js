const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const apiError = require('../utilis/apiError');
const SubCategory = require('../models/subCategory');
const Category = require('../models/category');
module.exports.createSubCategory = asyncHandler(async (req, res) => {
    const name = req.body.name
    const subCategory = await SubCategory.create({
        name,
        slug: slugify(name),
        category: req.body.category
    })
    res.status(201).json({ data: subCategory })
})

exports.setCategoryIdBody = (req,res,next)=>{
   if(!req.body.category) req.body.category = req.params.categoryId
   next()
}

// GET /api/v1/categories/categoryId/subCategories

module.exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    let filterObject = {}
    if(req.params.categoryId) filterObject = {category : req.params.categoryId}
    console.log(filterObject)
    const subCategories = await SubCategory.find(filterObject)
        .skip(skip)
        .limit(limit)
    res.status(201).json({ results: subCategories.length, page: page, data: subCategories })
})

module.exports.getSingleSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const subCategory = await SubCategory.findById(id)
    if (!subCategory) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no subCategory for this id ${id}`, 404))
    }
    res.status(201).json(subCategory)
})



module.exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body
    const subCategory = await SubCategory.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
            category
        }
        , { new: true })
    if (!subCategory) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no subCategory for this id ${id}`, 404))
    }
    res.status(201).json(subCategory)
})



module.exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const subCategory = await SubCategory.findByIdAndDelete(id)
    if (!subCategory) {
        //res.status(404).json({ message: `no category for this id ${id}` })
        return next(new apiError(`no subCategory for this id ${id}`, 404))
    }
    res.status(201).json({ message: 'subCategory deleted' })
})