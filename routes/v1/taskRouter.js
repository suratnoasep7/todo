const router = require('express').Router();
const taskController = require('../../controller/taskController.js')
const auth = require('../../middleware/auth.js')

router.post('/create', auth, taskController.createTodo)
router.put('/update/:id', auth, taskController.updateTodo)
router.delete('/delete/:id', auth, taskController.deleteTodo)
router.get('/show/:id', auth, taskController.showTodo)
router.get('/index', auth, taskController.indexTodo)

module.exports = router;
