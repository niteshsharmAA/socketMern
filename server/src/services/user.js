const { userModal } = require('../models');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

exports.registerUser = async (req) => {
    try {
        const saveUser = await userModal.create(req.body);
        return {
            success: true,
            message: 'user inserted successfully.',
            data: saveUser
        }
    } catch (error) {
        throw error;
    }
}

exports.login = async (reqData) => {
    try {
        const findUser = await userModal.findOne(reqData);
        if (!findUser) {
            return {
                success: false,
                message: 'Invaild email or password.',
                data: {}
            }
        }
        await userModal.updateOne(
            { _id: mongoose.Types.ObjectId(findUser._id) },
            { isOnline: true }, { new: true });
        return {
            success: true,
            message: 'Login successfully.',
            data: {
                userInfo: {
                    email: findUser.email,
                    name: findUser.name,
                    image: findUser.image,
                    _id: findUser._id,
                    isOnline: findUser.isOnline
                },
                token: `mernChat ${jwt.sign({ email: findUser.email, name: findUser.name, _id: findUser._id }, process.env.JWT_TOKEN_SECRET_KEY)}`
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.getUserProfile = async (req) => {
    try {
        const { _id } = req.admin
        const findUser = await userModal.findOne({ _id: mongoose.Types.ObjectId(_id) }).select({ password: 0, __v: 0 });
        if (!findUser) {
            return {
                success: false,
                message: 'user not found',
                data: {}
            }
        }
        return {
            success: true,
            message: 'user profile.',
            data: findUser
        }
    } catch (error) {
        throw error;
    }
}

exports.getAllUser = async (req) => {
    try {
        const { _id } = req.admin;
        const findUser = await userModal.find({ _id: { $ne: mongoose.Types.ObjectId(_id) } }).select({ password: 0, __v: 0 });
        if (!findUser || findUser.length == 0) {
            return {
                success: false,
                message: 'user not found',
                data: {}
            }
        }
        return {
            success: true,
            message: 'user profile.',
            data: findUser
        }
    } catch (error) {
        throw error;
    }
}