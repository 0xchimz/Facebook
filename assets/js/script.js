/**
* sellsukiFacebook Module
*
* Load all Facebook page's comment order by update time, which seller can reply comment.
*/
var app = angular.module('sellsukiFacebook', ['ngRoute', 'Service']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
	.when('/', {
		templateUrl : 'template/index.html',
		controller : 'mainController'
	})
	
	.when('/read', {
		templateUrl : 'template/index.html',
		controller : 'mainController'
	})

	.otherwise({
		redirectTo : '/'
	});

	$locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$window', 'facebookService', function($rootScope, $window, sAuth){
	
	$rootScope.user = null;

	$window.fbAsyncInit = function() {
		FB.init({
			appId		: '958384294182592',
			oauth		: true,
			status		: true,
			cookie		: true,
			xfbml		: true,
			version		: 'v2.3'
		});

		sAuth.watchAuthenticationStatusChange();
	};

	(function(d){
		var js, 
		id = 'facebook-jssdk', 
		ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); 
		js.id = id; 
		js.async = true;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		ref.parentNode.insertBefore(js, ref);

	}(document));
}]);

app.controller('mainController', ['$scope', 'facebookService', function($scope, sAuth){
	
	$scope.fbLogin = function(){
		console.log('Do login!');
		sAuth.fbLogin();
	};

}]);