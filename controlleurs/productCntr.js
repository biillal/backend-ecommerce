const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const apiError = require('../utilis/apiError');
const path = require('path');
const fs = require('fs');
const { cloudinarayUploadImage } = require('../utilis/cloudinary');
const { Product } = require('../models/product');

module.exports.createProduct = asyncHandler(async(req,res,next)=>{
    const {title , description,quantity,price,priceAfterDiscount,category,subCategory,brand} = {...req.body}
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinarayUploadImage(imagePath)
    const product = await Product.create({
        title,
        description,
        quantity,
        price,
        priceAfterDiscount,
        image:{
            url : result.secure_url,
            publicId:result.public_id
        },
        category,
        subCategory,
        brand
    })
    res.status(201).json({result:product.length,product:product})
    fs.unlinkSync(imagePath)
})




module.exports.getProduct = asyncHandler(async (req, res) => {
    const queryStringObj = { ...req.query }
    const excludesFields = ['page', "sort", "limit", "fields"]
    excludesFields.forEach(field => delete queryStringObj[field])

    let queryStr = JSON.stringify(queryStringObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    //pagination
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    let mongooseQuery = Product.find(JSON.parse(queryStr))
        .skip(skip)
        .limit(limit)
        .populate({ path: "category", model: Category, select: 'name -_id' })

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        mongooseQuery = mongooseQuery.sort(sortBy)
    } else {
        mongooseQuery = mongooseQuery.sort('-createAt')
    }

    //fields
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        mongooseQuery = mongooseQuery.select(fields)
    } else {
        mongooseQuery = mongooseQuery.select('-__v')
    }

    //search 
    if (req.query.keyword) {
        const query = {}
        console.log(query);
        console.log(req.query.keyword);
        query.$or = [
            {name:{$regex:req.query.keyword,$options:"i"} }
        ];
        console.log(query);
        mongooseQuery = mongooseQuery.find(query)
    }
    const products = await mongooseQuery
    res.status(201).json({ results: products.length, page: page, data: products })
})


module.exports.getSingleProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const product = await Product.findById(id).populate({ path: "category", model: Category, select: 'name -_id' })
    if (!product) {
        //res.status(404).json({ message: `no product for this id ${id}` })
        return next(new apiError(`no product for this id ${id}`, 404))
    }
    res.status(201).json(product)
})



module.exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const product = await Product.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name)
        }
        , { new: true })
    if (!product) {
        //res.status(404).json({ message: `no product for this id ${id}` })
        return next(new apiError(`no product for this id ${id}`, 404))
    }
    res.status(201).json(product)
})



module.exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        //res.status(404).json({ message: `no product for this id ${id}` })
        return next(new apiError(`no product for this id ${id}`, 404))
    }
    res.status(201).json({ message: 'product deleted' })
})