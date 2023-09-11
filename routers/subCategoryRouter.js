const { getSingleSubCategory, updateSubCategory, deleteSubCategory, createSubCategory, getSubCategories, setCategoryIdBody } = require('../controlleurs/subCategoryServices')
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../utilis/validators/subCategoryValidator')

const router = require('express').Router({mergeParams:true})

router.route('/')
        .post(setCategoryIdBody,createSubCategoryValidator,createSubCategory)
        .get(getSubCategories)

router.route('/:id')
        .get(getSubCategoryValidator,getSingleSubCategory)
        .put(updateSubCategoryValidator,updateSubCategory)
        .delete(deleteSubCategoryValidator,deleteSubCategory)
module.exports = router