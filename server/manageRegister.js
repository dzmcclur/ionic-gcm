server.post('/register', function(req, res, next){
    var device = req.params;	

    console.log('device token received');
    console.log(device._id);
    db.devices.insert(device,
        function (err, data) {
		console.log("insert function entered");
            if (err) { // duplicate key error
		console.log("duplicate key error");
                if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                    res.writeHead(400, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
						console.log("res writeHead(400)");
                    res.end(JSON.stringify({
                        error: err,
                            message: "This device already registered"
                    }));
			console.log("JSON stringify - this device already registered");
                }   
            } else {
		console.log("no duplicate key");
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            }
        });
	console.log("return next");
    return next();
	console.log("res.send ok");
    res.send('ok');
});
