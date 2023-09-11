const { getAllUsers, getSingleUser, updateUser, deleteUser } = require('../controlleurs/userCntr')
const { verifyTokenAndOnlyUser, verifyTokenAdminAndUser } = require('../middlewares/jwtMiddleware')


const router = require('express').Router()

router.route('/')
            .get(getAllUsers)
router.route('/:id')
            .get(getSingleUser)
            .put(verifyTokenAndOnlyUser,updateUser)
            .delete(verifyTokenAdminAndUser,deleteUser)
module.exports = router