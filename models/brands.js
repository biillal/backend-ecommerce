const mongoose = require('mongoose')

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category required'],
        minlength: [3, "too short category"],
        maxlength: [32, "too long category"],
        unique: [true, 'category must be unique']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        },
    }
}, { timestamps: true })


const Brand = mongoose.model('brand', brandSchema)

module.exports = Brand