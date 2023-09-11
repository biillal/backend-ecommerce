const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const verificationTokenSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    token:{
        type:String,
        required:true
    }

}, { timestamps: true })


const VarificationToken = mongoose.model('varificationToken', verificationTokenSchema)

module.exports = {
    VarificationToken
}