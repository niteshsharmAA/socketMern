const route  = require('express').Router();

route.get('/check', (req, res) => res.status(200).json({ success: true, message: 'project running fine 💗' }));

module.exports = route;