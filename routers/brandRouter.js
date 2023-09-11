const { getSingleBrand, updateBrand, createBrand, getBrands, deleteBrand } = require('../controlleurs/brandServices')
const photoUpload = require('../middlewares/photoUpload')
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../utilis/validators/brandValidator')
const router = require('express').Router()
router.route('/').post(photoUpload.single("image"),createBrandValidator,createBrand).get(getBrands)

router.route('/:id').get(getBrandValidator,getSingleBrand).put(updateBrandValidator,updateBrand).delete(deleteBrandValidator,deleteBrand)
module.exports = router