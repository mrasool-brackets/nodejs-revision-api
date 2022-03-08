const express = require("express");

const router = express.Router();

// Middlewares
const checkAuth = require("../middlewares/checkAuth")

// Contollers
const orderController = require('../controllers/orders')

router.get('/', checkAuth, orderController.getAllOrders)
router.post('/', checkAuth, orderController.placeOrder)
router.get('/:orderId', checkAuth, orderController.getOrderDetails)
router.delete('/:orderId', checkAuth, orderController.deleteOrder)

module.exports = router;