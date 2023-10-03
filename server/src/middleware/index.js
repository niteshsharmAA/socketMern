// Global imports
const jwt = require('jsonwebtoken');

exports.jwtVerifyForAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer mernChat ')[1];
        // console.log(`token`, token);
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, async (err, encoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    // error: err.message || err
                });
            } else {
                // console.log(`encoded>>>>>>>>>>>>>>>>>>>>>>`, encoded);
                req.admin = {
                    _id: encoded._id,
                    email: encoded.email,
                    name: encoded.name
                }
                next();
            }
        });
    } catch (error) {
        // const err = new Error(error);
        return res.status(401).json({
            success: false,
            message: 'Token Required',
            // error: err.message || err
        });
    }
};

exports.jwtVerifyForAdminSocket = async (token, user) => {
    try {
        const tokenCheck = token.split('Bearer mernChat ')[1];
        // console.log(`token`, token);
        jwt.verify(tokenCheck, process.env.JWT_TOKEN_SECRET_KEY, async (err, encoded) => {
            if (err) {
                throw err;
            }
            // console.log(`encoded>>>>>>>>>>>>>>>>>>>>>>`, encoded);
            user._id = encoded._id 
            // user. = {
            //     _id: encoded._id,
            //     email: encoded.email,
            //     name: encoded.name
            // };
            // return user

        });
    } catch (error) {
        // const err = new Error(error);
        throw error;
    }
};