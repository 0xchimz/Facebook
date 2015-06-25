/**
* Service Module
*
* All service is here.
*/
var service = angular.module('Service', []);

service.factory('facebookService', ['$rootScope', '$state', function($rootScope, $state){

	this.user = {};

	var fbUserInfo = function(){
		FB.api('/me', function(res) {
			$rootScope.$apply(function() { 
				$rootScope.user = user = res;
				$state.go('home', {});
			});
		});
	};

	var fbAuthStatus = function(){
		FB.Event.subscribe('auth.authResponseChange', function(res) {
			if (res.status === 'connected') {
				fbUserInfo();
			}else{
				$state.go('login', {});
			}
		});
	};

	var fbLogout = function() {
		FB.logout(function(response) {
			$rootScope.$apply(function() { 
				$rootScope.user = user = null; 
			}); 
		});
	};

	var fbLogin = function(){
		FB.login(function(response){
			console.log('Do login!');
			if (response.authResponse) {
				console.log('Welcome!  Fetching your information.... ');
				access_token = response.authResponse.accessToken;
				user_id = response.authResponse.userID;
				fbUserInfo();
				$state.go('home', {});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {
			scope: 'public_profile,email'
		});
	};

	var fbCheckAuth = function(){
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				var uid = response.authResponse.userID;
				var accessToken = response.authResponse.accessToken;
				$state.go('home', {});
			} else if (response.status === 'not_authorized') {
				$state.go('login', {});
			} else {
				$state.go('login', {});
			}
		}, true);
	};

	var isLogin = function(){
		if($rootScope.user != null){
			$state.go('home', {});
		}else{
			$state.go('login', {});
		}
	}

	return {
		fbAuthStatus: fbAuthStatus,
		fbUserInfo: fbUserInfo,
		fbLogin: fbLogin,
		fbLogout: fbLogout,
		fbCheckAuth: fbCheckAuth,
		isLogin: isLogin
	};
}]);