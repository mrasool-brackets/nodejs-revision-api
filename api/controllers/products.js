const mongoose = require("mongoose");

const Product = require("../models/Product")

exports.getAllProducts = async (req, res, next) => {
    try {
        let listProducts = await Product
            .find()
            .select("-__v")
            .exec();
        res.status(200).json({
            product: listProducts.map(p => {
                return {
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    url: "http://localhost:3000/products/"+p._id,
                    image: "http://localhost:3000/"+p.productImage
                }
            }),
            count: listProducts.length
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.addNewProduct = async (req, res, next) => {
    try {
        let newProduct = new Product({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
        })
        if (req.file) {
            newProduct["productImage"] = req.file.path    
        }
        const saveProduct = await newProduct.save();
        res.status(201).json({
            msg:"New product added successfully.",
            product: {
                id: saveProduct._id,
                name: saveProduct.name,
                image: "http://localhost:3000/"+saveProduct.productImage,
                price: saveProduct.price
            }
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        let id = req.params.productId
        let productDetails = await Product.findById(id).select("-__v").exec();
        if (productDetails)
            res.status(200).json({
                product: productDetails,
            })
        else
            res.status(404).json({
                msg:"Product not found.",
            })
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        let id = req.params.productId
        let productStatus = await Product.findByIdAndDelete(id);
        if (productStatus)
            res.status(200).json({
                msg:"Product deleted.",
            })
        else {
            res.status(404).json({
                msg:"Product not found"
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        let id = req.params.productId
        let updateOps = {}
        for (const ops of req.body){
            updateOps[ops.propName] = ops.propValue
        }
        let updatedProduct = await Product.findByIdAndUpdate(id, updateOps).exec();
        if(updatedProduct){
            res.status(200).json({
                msg:"Product Updated."
            })    
        } else {
            res.status(404).json({
                msg:"Product Not Found"
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}