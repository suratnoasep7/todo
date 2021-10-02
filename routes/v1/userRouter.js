const router = require('express').Router()
const userController = require('../../controller/userController.js')
const auth = require('../../middleware/auth.js')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/show', auth, userController.show)
router.delete('/delete', auth, userController.deleteUser)

module.exports = router
