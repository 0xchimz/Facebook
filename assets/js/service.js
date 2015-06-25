/**
* Service Module
*
* All service is here.
*/
var service = angular.module('Service', []);

service.factory('facebookService', ['$rootScope', function($rootScope){

	var fbUserInfo = function(){
		var _self = this;

		FB.api('/me', function(res) {
			console.log(res);
			$rootScope.$apply(function() { 
				$rootScope.user = _self.user = res; 
			});
		});
	};

	var watchAuthenticationStatusChange = function(){
		var _self = this;

		FB.Event.subscribe('auth.authResponseChange', function(res) {
			if (res.status === 'connected') {
				_self.fbUserInfo();
			} else {
				$rootScope.user = _self.user = {}; 
			}

		});
	};

	var fbLogin = function(){
		FB.login(function(response){
			console.log('Do login!');
			if (response.authResponse) {
				console.log('Welcome!  Fetching your information.... ');
				access_token = response.authResponse.accessToken;
				user_id = response.authResponse.userID;

				FB.api('/me', function(response) {
					user_email = response.email;
				});

			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		}, {
			scope: 'public_profile,email'
		});
	};

	return {
		watchAuthenticationStatusChange : watchAuthenticationStatusChange,
		fbUserInfo: fbUserInfo,
		fbLogin: fbLogin
	};
}]);