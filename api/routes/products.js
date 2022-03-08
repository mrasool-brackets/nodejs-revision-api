const express = require("express");
const multer = require("multer");

const router = express.Router();

// Middlewares
const checkAuth = require('../middlewares/checkAuth')

// Controllers
const productContollers = require("../controllers/products")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(new Error("Invalid File Type"), false)
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
})

// Routes
router.get('/', productContollers.getAllProducts)
router.post('/', checkAuth, upload.single('productImage'), productContollers.addNewProduct)
router.get('/:productId', productContollers.getProductById)
router.delete('/:productId', checkAuth, productContollers.deleteProduct)
router.patch('/:productId', checkAuth, productContollers.updateProduct)

module.exports = router;