const express = require("express");
const router = express.Router();

// Middleware
const checkAuth = require('../middlewares/checkAuth')
const checkRole = require('../middlewares/checkRole')

// Controller
const userControllers = require('../controllers/users')

// Routes
router.get('/', checkAuth, checkRole('admin'), userControllers.getAllUsers)
router.post('/signup', userControllers.signup)
router.post('/signup_admin', checkAuth, checkRole('admin'), userControllers.createNewAdmin)
router.post('/signin', userControllers.signin)
router.get('/:userId', checkAuth, userControllers.getUserById)
router.delete('/:userId', checkAuth, checkRole('admin'), userControllers.deleteUser)
router.patch('/:userId', checkAuth, checkRole('admin'), userControllers.updateUser)

module.exports = router;