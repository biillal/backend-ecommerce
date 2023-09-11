const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category is required']
    },

    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        },
    }
},{timestamps: true})

const Category = mongoose.model('categogie',categorySchema)

module.exports = {
    Category
}