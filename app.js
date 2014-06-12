var express = require('express');
var session = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var Controllers = require('./controllers');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: 'dreamchat',
    cookie:{
        maxAge: 60 * 1000
    }
}));

app.get('/api/validate', function (req, res) {
    var _userId = req.session._userId;
    if (_userId) {
        Controllers.User.findUserById(_userId, function (err, user) {
            if (err) {
                res.json(401, {msg: err})
            } else {
                res.json(user)
            }
        })
    } else {
        res.json(401, null)
    }
});

app.post('/api/login', function (req, res) {
    var email = req.body.email
    if (email) {
        Controllers.User.findByEmailOrCreate(email, function(err, user) {
            if (err) {
                res.json(500, {msg: err})
            } else {
                req.session._userId = user._id;
                res.json(user)
            }
        })
    } else {
        res.json(403)
    }
});

app.get('/api/logout', function (req, res) {
    req.session._userId = null;
    res.json(401);
});

app.use(function (req, res, next) {
    res.sendfile('./static/index.html');
});

var io = require('socket.io').listen(app.listen(port));

var messages = [];

io.sockets.on('connection', function (socket) {
    socket.on('getMessageList', function () {
        socket.emit('messageList', messages)
    });
    socket.on('createMessage', function (message) {
        var mes = {content: message};
        messages.push(mes);
        io.sockets.emit('message', mes)
    })
});
