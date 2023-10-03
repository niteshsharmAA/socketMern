const route = require('express').Router();
const { registerUser, login, getUserProfile, getAllUser } = require('../services/user');
const { jwtVerifyForAdmin } = require('../middleware');

route.post('/user/register', async (req, res) => {
    try {
        const result = await registerUser(req);
        if (result.success) res.status(200).json(result);
    } catch (error) {
        throw error;
    }
});

route.post('/user/login', async (req, res) => {
    try {
        const result = await login(req.body);
        if (!result.success) return res.status(400).json(result);
        return res.status(200).json(result);
    } catch (error) {
        throw error;
    }
});

route.get('/user/profile', jwtVerifyForAdmin, async (req, res) => {
    try {
        const result = await getUserProfile(req);
        if (!result.success) return res.status(400).json(result);
        return res.status(200).json(result);
    } catch (error) {
        throw error;
    }
});

route.get('/user/getAll', jwtVerifyForAdmin, async (req, res) => {
    try {
        const result = await getAllUser(req);
        if (!result.success) return res.status(400).json(result);
        return res.status(200).json(result);
    } catch (error) {
        throw error;
    }
});

module.exports = route;
