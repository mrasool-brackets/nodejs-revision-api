const express = require("express");
const app = express();
const morgan = require("morgan")
const parser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_PW +'@cluster0.aatxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (err) => {
    if (err) console.log("Error in Connecting to dB");
    else console.log("Successfully Connected to dB")
})

// Middlewares
app.use(morgan('dev'));
app.use('/uploads', express.static("uploads"))
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());
app.use(cors());

// Routers
const productRouter = require("./api/routes/products")
const orderRouter = require("./api/routes/orders")
const userRouter = require("./api/routes/users")

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);

// Error Handling
app.use((req, res, next) => {
    const error = new Error("Endpoint Not Found");
    error.status = 404
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;