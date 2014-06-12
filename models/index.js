var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dreamchat')
exports.User = mongoose.model('User', require('./user'))
