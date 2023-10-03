const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('DB conneted');
}).catch(err=>{
    console.log(err.message);
});