var gcm = require('node-gcm');

var findEnabledDevices = function(db, callback) {
	db.devices.find({"enabled":"true"}, function(err, data) {
		if(err) {
			console.log(err);
		} else if (data.length) {
			console.log('results: ',data);
			callback(data);
		} else {
			console.log('no devices with push enabled');
		}
	});
};
	

module.exports = function(server, db) {

	server.post('/register', function(req, res, next){
		var device = req.params;	

		console.log('device token received');
		console.log(device._id);
		db.devices.insert(device,function (err, data) {
			
			if (err) { // duplicate key error
				if (err.code == 11000)  { /* http://www.mongodb.org/about/contributors/error-codes/*/
					res.writeHead(400, {
						'Content-Type': 'application/json; charset=utf-8'
					});
					res.end(JSON.stringify({
						error: err,
						message: "This device already registered"
					}));
				}   
			} else {
				res.writeHead(200, {
					'Content-Type': 'application/json; charset=utf-8'
				});
				res.end(JSON.stringify(data));
			}
		});
		return next();
		res.send('ok');
	});

	server.get('/push', function(req, res){

    	var device_tokens = []; //create array for storing device tokens
    	var retry_times = 4; //the number of times to retry sending the message if it fails

	    var sender = new gcm.Sender('AIzaSyBEMG9iHR-KsfcyLHwnhMRdFHzM4rkrP-M'); //create a new sender
    	var message = new gcm.Message(); //create a new message

	    message.addData('title', 'New Message');
    	message.addData('message', 'Hello this is a push notification');
	    message.addData('sound', 'notification');

    	message.collapseKey = 'testing'; //grouping messages
	    message.delayWhileIdle = true; //delay sending while receiving device is offline
    	message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline
		
		findEnabledDevices(db, function(data){	    

			for(device_token in data)
    		{
    			device_tokens.push(data[device_token]._id);
		    }
			console.log("Devices: ");
			console.log(device_tokens);
			var count = Number(device_token)+1;
			sender.send(message, device_tokens, retry_times, function(err, result){
				if(err) console.error(err);
				else console.log(result);
        		console.log('push sent to: ' + count + " devices");
    		});
		});

    	res.send('ok');
	});
};