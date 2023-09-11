const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'subCategory required'],
        minlength: [3, "too short subCategory"],
        maxlength: [32, "too long subCategory"],
        unique: [true, 'subCategory must be unique']
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        require:[true,"category required"]
    }
}, { timestamps: true })


const SubCategory = mongoose.model('subCategory', subCategorySchema)

module.exports = SubCategory