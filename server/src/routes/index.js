const apiPrefix = '/api/v1';
module.exports = (app) => {
    app.use(apiPrefix, require('./health'));
    app.use(apiPrefix, require('./user'));
    app.use(apiPrefix, require('./chat'));
};