const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User")

exports.getAllUsers = async (req, res, next) => {
    try {
        const listUsers = await User
            .find()
            .select("name email role")
            .exec();
        res.status(200).json({
            user: listUsers,
            count: listUsers.length
        });
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.signup = async (req, res, next) => {
    try {
        const alreadyExist = await User.find({email:req.body.email}).exec()
        if (alreadyExist.length){
            res.status(409).json({
                log:"Email already exist. Please Login to Continue.",
            })    
        } else {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error){
                        reject(new Error("Hashing Failed."))
                    }
                    else {
                        resolve(hash)
                    }
                })
            })
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
            })
            let saveUser = await newUser.save();
            res.status(201).json({
                msg:"Congratulations. Your Account is created.",
                info: {
                    name:saveUser.name,
                    email:saveUser.email
                }
            });            
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.createNewAdmin = async (req, res, next) => {
    try {
        const alreadyExist = await User.find({email:req.body.email}).exec()
        if (alreadyExist.length){
            res.status(409).json({
                msg:"Email already exist. Please Login to Continue.",
            })    
        } else {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error){
                        reject(new Error("Hashing Failed."))
                    }
                    else {
                        resolve(hash)
                    }
                })
            })
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
                role: 'admin'
            })
            let saveUser = await newUser.save();
            res.status(201).json({
                msg:"Congratulations. Admin account is created.",
                info: {
                    name:saveUser.name,
                    email:saveUser.email
                }
            });            
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.signin = async (req, res, next) => {
    try {
        const isExist = await User.findOne({email:req.body.email}).exec()
        console.log(isExist)
        if (!isExist){
            res.status(401).json({
                msg:"Invalid email or password.",
            })    
        } else {
            const matchPassword = await new Promise((resolve, reject) => {
                bcrypt.compare(req.body.password, isExist.password, (error, done) => {
                    if (error){
                        reject(new Error("Invalid email or password."))
                    }
                    else {
                        resolve(done)
                    }
                })
            })
            if (matchPassword){
                const token = jwt.sign({
                    email: isExist.email,
                    id: isExist._id,
                    role: isExist.role
                }, process.env.JWT_PW,
                {
                    expiresIn:'1h'
                })
                res.status(200).json({
                    msg:"Auth Success. Welcome !",
                    token
                })
            }
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        let id = req.params.userId
        let userDetails = await User.findById(id).select('-__v -password').exec();
        if (userDetails)
            res.status(200).json({
                user: userDetails,
            })
        else
            res.status(404).json({
                msg:"User does not exist.",
            })
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        let id = req.params.userId
        let userStatus = await User.findByIdAndDelete(id);
        if (userStatus)
            res.status(200).json({
                msg:"Profile deleted successfully."
            })
        else {
            res.status(404).json({
                msg:"User does not exist."
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let id = req.params.userId
        let updateOps = {}
        for (const ops of req.body){
            updateOps[ops.propName] = ops.propValue
        }
        let updatedUser = await User.findByIdAndUpdate(id, updateOps).exec();
        if(updatedUser){
            res.status(200).json({
                msg:"Profile update success."
            })    
        } else {
            res.status(404).json({
                msg:"User does not exist."
            })
        }
    } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
    }
}