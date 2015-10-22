//ionic-gcm
var mongojs     =   require('mongojs');
var morgan  	=   require('morgan');
var db          =   mongojs('notifications', ['devices']);
var restify     =   require('restify');
var server      =   restify.createServer();

var bodyParser = require('body-parser');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); // LOGGER

// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(3000, function () {
    console.log("Server started @ port 3000");
});

var manageDevices =   require('./managePush')(server, db);


