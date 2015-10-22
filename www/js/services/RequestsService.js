(function(){

    angular.module('starter')
    .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);
	console.log("entered RequestsService");
    function RequestsService($http, $q, $ionicLoading){

        var base_url = 'http://app.tngworldwide.com:3000';
	console.log(base_url);
        function register(device_token){
		console.log("entered RequestsService: Register");
            var deferred = $q.defer();
            $ionicLoading.show();
	    console.log("$http.post: "+device_token);
            $http.post(base_url + '/register', {_id:device_token,enabled:'true'})
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();
