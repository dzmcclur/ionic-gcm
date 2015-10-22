// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, RequestsService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

	var push = PushNotification.init({'android': {'senderID': '189284374097'}});

	push.on('registration', function(data) {
		console.log("registration event");
		console.log(JSON.stringify(data));

		 RequestsService.register(data.registrationId).then(function(response){
              alert('registered with app.tngworldwide.com!');
            });
		
    });

    push.on('notification', function(data) {
        console.log("notification event");
		console.log(JSON.stringify(data));
		var cards = document.getElementById("cards");
		var push = '<div class="row">' +
			'<div class="col s12 m6">' +
			'  <div class="card darken-1">' +
			'    <div class="card-content black-text">' +
			'      <span class="card-title black-text">' + data.title + '</span>' +
			'      <p>' + data.message + '</p>' +
			'    </div>' +
			'  </div>' +
			' </div>' +
			'</div>';
            cards.innerHTML += push;
    });

    push.on('error', function(e) {
       console.log("push error");    
	});

})

});  

