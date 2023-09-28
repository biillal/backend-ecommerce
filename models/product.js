const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is required"]
    },
    description:{
        type:String,
        required:[true,"description is required"],
        minLenght:[10,'description must be at least 10 characters']
    },
    sold:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        required:[true,"quantity is required"],
    },
    price:{
        type:Number,
        required:[true,"price is required"],
        trim:true
    },
    priceAfterDiscount:{
        type:Number
    },
    colors:[String],
    image:{
        type: Object,
        default: {
            url: "",
            publicId: null
        },
        required:true
    },
    images:[String],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true,"Product must be belong to category"]
    },
    subCategory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
    }],
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
    },
    rate:{
      type:Number,
      required:true,
      default:0
    },
    numberOfReviews:{
        type:Number,
        required:true,
        default:0
    },
    reviews:[],

},{timestamps:true})


const Product = mongoose.model('product',productSchema)

module.exports = {
    Product
}