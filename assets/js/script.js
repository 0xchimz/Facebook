/**
* sellsukiFacebook Module
*
* Load all Facebook page's comment order by update time, which seller can reply comment.
*/
var app = angular.module('sellsukiFacebook', ['ui.router', 'Service']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/login");

	$stateProvider
	.state('login', {
		url: '/login/',
		templateUrl : 'templates/login.tmpl.html',
		controller : 'loginController'
	})
	.state('home', {
		url: '/home/',
		templateUrl : 'templates/home.tmpl.html',
		controller : 'homeController'
	});
}]);

app.run(['$rootScope', '$window', '$location', 'facebookService', function($rootScope, $window, $location, sAuth){
	
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

		sAuth.fbAuthStatus();
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

app.controller('loginController', ['$scope', 'facebookService', function($scope, sAuth){

	sAuth.isLogin();

	$scope.fbLogin = function(){
		console.log('Do login!');
		sAuth.fbLogin();
	};

}]);

app.controller('homeController', ['$scope', '$location','facebookService', function($scope, $location, sAuth){

	sAuth.isLogin();

	$scope.fbLogout = function(){
		console.log('Do logout!');
		sAuth.fbLogout();
	};

}]);