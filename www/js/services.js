angular.module('starter.services', [])

.factory('API', function ($rootScope, $http, $ionicLoading, $window) {
       var base = "http://45.79.213.195:9804"; //This is the node server
       var base_url = "http://app.tngworldwide.com:3000";
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };
	$rootScope.hide = function () {
            $ionicLoading.hide();
        };
     

        $rootScope.logout = function () {
            $rootScope.setToken("");
            $window.location.href = '#/tab/signin';
        };

        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };

        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('getAllRewards');
            else
                $rootScope.$broadcast('fetchCompleted');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };

        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
	
	$rootScope.setState = function (state) {
            return $window.localStorage.state = state;
        }

        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }

        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }

        return {
            signin: function (form) {
                return $http.post(base+'/api/v1/tisRewards/tab/login', form);
            },
            signup: function (form) {
                return $http.post(base+'/api/v1/bucketList/auth/register', form);
            },
            getAllRewards: function (soldto) {
                return $http.get(base+'/api/v1/rewardsLevels/data/list', {
                    method: 'GET',
                    params: {
                        token: soldto
                    }
                });
            },
	    getRewardsCoupons: function (soldto) {
		return $http.get(base+'/api/v1/rewardsCoupons/data/list', {
                    method: 'GET',
                    params: {
                        token: soldto
                    }
                });
            },
	    getThankYouCoupons: function (soldto) {
                return $http.get(base+'/api/v1/couponThankYou/data/list', {
                    method: 'GET',
                    params: {
                        token: soldto
                    }
                });
            },
	    getWeMissYouCoupons: function (soldto) {
                return $http.get(base+'/api/v1/couponWeMissYou/data/list', {
                    method: 'GET',
                    params: {
                        token: soldto
                    }
                });
            },
	    pushRegister: function(device_token){

            var deferred = $q.defer();
            $ionicLoading.show();

            $http.post(base_url + '/register', {'device_token': device_token})
                .success(function(response){

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function(data){
                    deferred.reject();
                });


            return deferred.promise;

            },

            getAllStores: function () {
                return $http.get(base+'/api/v1/rewardsStores/data/list', {
                    method: 'GET'
		    
                });
            }
        }
    })

.service('sharedProperties', function ($rootScope, $window) {
        var clientNumber = '';
	var clientState = '';

        return {
            getClientNumber: function () {
                return clientNumber ;
            },
            setClientNumber: function(value) {
                clientNumber = value;
            },
	    getClientState: function () {
                return clientState ;
            },
            setClientState: function(value) {
                clientState = value;
		if(clientState == "MI")
		{
			$window.localStorage.michigan = true;
		}
		else
		{
			$window.localStorage.michigan = false;
		}
            },
	    isInMI: function(){
		return $window.localStorage.michigan;
	    }
        };
    })

.factory('menuItemsService', function($rootScope, API, sharedProperties,$window,$ionicHistory) {
	var shopURL = 'http://staging.theindustrysource.com';
	$rootScope.goToDepartment = function(){
		if($ionicHistory.currentView().url != '/side/shop'){
			shopURL = 'http://staging.theindustrysource.com/app-nav';
			$window.location.href = ('#/side/shop'); //Change this route
		}
		if($ionicHistory.currentView().url == '/side/shop'){
			var win = document.getElementById("myIframeID").contentWindow;
			win.postMessage('go_dept','http://staging.theindustrysource.com')
			
		}	
	}
	$rootScope.goBack = function(){
		if($ionicHistory.currentView().url == '/side/shop'){
			var win = document.getElementById("myIframeID").contentWindow;
			win.postMessage('go_back','http://staging.theindustrysource.com');
		} 	
	}

	$rootScope.hideBack = function(){
		if($ionicHistory.currentView().url != '/side/shop'){
			return 0;
		}
	}
	return{
		getShopURL: function(){
			return shopURL;
		},
		menuList: function() {
			var items = [];
			if($rootScope.isSessionActive()){
				if(sharedProperties.isInMI())
				{ items = [{label:'Account',href:'#/side/account'},
					{label:'Dashboard',href:'#/side/dash'},
					{label:'Home',href:'#/side/shop'},
					{label:'Store Locator',href:'#/side/loc'},
					{label:'Rewards',href:'#/side/rewards'},
					{label:'Coupons',href:'#/side/coupons'}];
				} else {
				  items = [{label:'Account',href:'#/side/account'},
					{label:'Dashboard',href:'#/side/dash'},
					{label:'Home',href:'#/side/shop'},
					{label:'Rewards',href:'#/side/rewards'},
					{label:'Coupons',href:'#/side/coupons'}];
				}
				
			}else{
				items = [{label:'Sign-in',href:'#/side/signin'},
					{label:'Dashboard',href:'#/side/dash'},
					{label:'Home',href:'#/side/shop'}];
			}
			return items;
		}
	};
    });