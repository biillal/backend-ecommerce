const { verifyTokenAndAdmin } = require('../middlewares/jwtMiddleware')
const photoUpload = require('../middlewares/photoUpload')
const { createProduct, getProduct, getSingleProduct, updateProduct, deleteProduct } = require('../services/productServices')
const { getProductValidator, updateProductValidator, deleteProductValidator, createProductValidator } = require('../utilis/validators/productValidator')
const subCategoryRouter = require('./subCategoryRouter')
const router = require('express').Router()
router.use('/:categoryId/subCategories',subCategoryRouter)
router.route('/').post(verifyTokenAndAdmin,photoUpload.single("image"),createProductValidator,createProduct).get(getProduct)

router.route('/:id').get(getProductValidator,getSingleProduct).put(verifyTokenAndAdmin,updateProductValidator,updateProduct).delete(verifyTokenAndAdmin,deleteProductValidator,deleteProduct)


module.exports = router