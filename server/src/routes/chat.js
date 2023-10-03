const route = require('express').Router();
const { getChats } = require('../services/chat');
const { jwtVerifyForAdmin } = require('../middleware');

route.get('/chat/getall/:id?', async (req, res) => {
    try {
        const result = await getChats(req);
        if (!result.success) return res.status(400).json(result);
        return res.status(200).json(result);
    } catch (error) {
        throw error;
    }
});

module.exports = route;
