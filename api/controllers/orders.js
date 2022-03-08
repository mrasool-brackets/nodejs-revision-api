const mongoose = require("mongoose");

// Models
const Order = require("../models/Order")
const Product = require("../models/Product")

exports.getAllOrders = async (req, res, next) => {
    try {
        let listOrders = await Order
            .find()
            .select("products quantity _id")
            .populate("products",["name"])
            .exec();
        res.status(200).json({
            orders: listOrders.map(o => {
                return {
                    _id: o._id,
                    products: o.products,
                    quantity: o.quantity,
                    url: "http://localhost:3000/orders/"+o._id
                }
            }),
            count: listOrders.length
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.placeOrder = async (req, res, next) => {
    try {
        let productStatus = await Product.findById(req.body.productId).exec()
        if (productStatus){
            const newOrder = new Order({
                _id: mongoose.Types.ObjectId(),
                products: req.body.productId,
                quantity: req.body.quantity
            })
            let saveOrder = await newOrder.save();
            res.status(201).json({
                msg:"Order placed.",
                details: saveOrder
            })
        } else {
            res.status(404).json({
                msg:"Product Not Found."
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.getOrderDetails = async (req, res, next) => {
    try {
        let id = req.params.orderId
        let orderDetails = await Order.findById(id).populate('products',["name"]).select("-__v").exec();
        if (orderDetails)
            res.status(200).json({
                order: orderDetails,
            })
        else
            res.status(404).json({
                msg:"Specified order does not Exist.",
            })
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        let id = req.params.orderId
        let orderStatus = await Order.findByIdAndDelete(id);
        if (orderStatus)
            res.status(200).json({
                msg:"Order cancelled."
            })
        else {
            res.status(404).json({
                msg:"Specified order does not exist."
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}