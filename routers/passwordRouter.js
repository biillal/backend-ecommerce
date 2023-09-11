const { sendResetPasswordLink, getResetPasswordLink, resetPassword } = require('../controlleurs/passwordCntr')
const { validateEmail, validateNewPassword } = require('../utilis/validators/userValidator')


const router = require('express').Router()

router.post('/reset-password-link',validateEmail,sendResetPasswordLink)

router.route('/reset-password/:userId/:token')
         .get(getResetPasswordLink)
         .post(validateNewPassword,resetPassword)
module.exports = router