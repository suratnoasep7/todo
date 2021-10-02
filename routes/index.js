const router = require('express').Router()
const taskRouter = require('./v1/taskRouter.js')
const userRouter = require('./v1/userRouter.js')

router.use('/task', taskRouter)
router.use('/user', userRouter)

module.exports = router;
