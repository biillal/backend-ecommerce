const { signUp, signIn, verifyUserAccount } = require('../controlleurs/authCntr')
const { signupValidator, loginValidator } = require('../utilis/validators/authValidator')

const router = require('express').Router()

router.post('/signup',signupValidator,signUp)
router.post('/signIn',loginValidator,signIn)


router.get('/:userId/verify/:token',verifyUserAccount)

module.exports = router