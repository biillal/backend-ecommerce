const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')
const apiError = require('../utilis/apiError')

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const user = await User.find({})
    res.status(201).json(user)
})

module.exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new apiError('User not found', 401))
    }
    res.status(201).json(user)
})

module.exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { username, phone } = { ...req.body }
    const user = await User.findByIdAndUpdate(
        id,
        {
            username,
            phone
        },
        { new: true }
    )

    if (!user) {
        return next(new apiError('User not found', 401))
    }
    res.status(201).json({message:"updated successfully",user})
})


module.exports.deleteUser = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.status(201).json({message:'User deleted successfully'})
})