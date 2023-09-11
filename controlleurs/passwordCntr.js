const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')
const apiError = require('../utilis/apiError')
const { VarificationToken } = require('../models/verificationToken')
const crypto = require('crypto')
const sendEmail = require('../utilis/sendEmail')
const bcrypt  = require('bcrypt')

module.exports.sendResetPasswordLink = asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new ApiError('user wirh given email does nor exist!',404))
    }
    let verificationToken = await VarificationToken.findOne({userId:user._id})
    if(!verificationToken){
        verificationToken = new VarificationToken({
            userId:user._id,
            token: crypto.randomBytes(32).toString("hex")
        })
        await verificationToken.save()
    }
    const link = `http://127.0.0.1:5173/reset-password/${user._id}/${verificationToken.token}`
    const htmlTemplate = `<a href="${link}">Click here to reset your password</a>`
    await sendEmail(user.email,"Reset Password",htmlTemplate)
    res.status(201).json({
        message:"Password reset link sent to your email , please check your inbox"
    })
})



module.exports.getResetPasswordLink = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new apiError('User not found', 401))
    }
    const verificationToken = await VarificationToken.findOne({
        userId: user._id,
        token: req.params.token
    })
    if (!verificationToken) {
        return next(new apiError('Invalid link', 401))
    }
    res.status(201).json({message:"Valid url"})

})




module.exports.resetPassword = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new apiError('User not found', 401))
    }
    const verificationToken = await VarificationToken.findOne({
        userId : user._id,
        token :req.params.token
    })
    if (!verificationToken) {
        return next(new apiError('Invalid link', 401))
    }
    if(!user.isAccountVarified){
        user.isAccountVarified = true
    }

    const hashPassword = await bcrypt.hash(req.body.password,12)
    user.password = hashPassword
    await user.save()
    const id = verificationToken._id
    await VarificationToken.findByIdAndDelete(id)
    res.status(201).json({ message: "Password reset successfully , please log IN" })

})