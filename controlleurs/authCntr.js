const asyncHandler = require('express-async-handler')
const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const apiError = require('../utilis/apiError')
const crypto = require('crypto')
const sendEmail = require('../utilis/sendEmail')
const { VarificationToken } = require('../models/verificationToken')
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY)
}

module.exports.signUp = asyncHandler(async (req, res, next) => {
    const { username, email, password, passwordConfirm } = { ...req.body }

    let users = new User({
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
    });
    await users.save()

    // create new veriefication token 
    const verifToken = new VarificationToken({
        userId: users._id,
        token: crypto.randomBytes(32).toString("hex")
    })
    await verifToken.save()
    console.log(verifToken);
    // making the link
    const link = `http://127.0.0.1:5173/users/${users._id}/verify/${verifToken.token}`
    //puting the link  into on html 
    console.log(link);
    const htmlTemplate = `
     <div >
       <p>click to the link below to verify your email </p>
       <a href="${link}">click to Verify </a>
     </div>
    `;
    console.log(htmlTemplate);

    //send email 
    await sendEmail(users.email, "Verify your email", htmlTemplate)
    res.status(201).json({ message: 'We sent to you an email , please verify your email address' })
})
module.exports.signIn = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new apiError('Incorrect email or password', 401))
    }
    if (!user.isAccountVarified) {
        return next(new apiError('We sent to you an email , please verify your email address', 401))
    }
    const token = createToken(user._id, user.role)
    res.status(201).json({ message: 'logged in successfully', user, token })
})



module.exports.verifyUserAccount = asyncHandler(async (req, res, next) => {
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
    console.log(verificationToken);
    user.isAccountVarified = true;
    await user.save()
    const id = verificationToken._id
    await VarificationToken.findByIdAndDelete(id)
    
    res.status(201).json({ message: "Your account verified" })
})
