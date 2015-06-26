/**
* sellsukiFacebook Module
*
* Load all Facebook page's comment order by update time, which seller can reply comment.
*/
/* global angular */
/* global FB */
/* global $ */
var app = angular.module('sellsukiFacebook', ['ui.router', 'Service'])

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.tmpl.html',
      controller: 'loginController'
    })
    .state('page', {
      url: '/page',
      templateUrl: 'templates/home.tmpl.html',
      controller: 'homeController'
    })
    .state('page.comment', {
      url: '/:pId?:access_token',
      templateUrl: 'templates/page.tmpl.html',
      controller: 'pageController'
    })
}])

app.run(['$rootScope', '$window', '$location', 'facebookService', function ($rootScope, $window, $location, sAuth) {
  $rootScope.user = null
  $rootScope.accessToken = null

  $window.fbAsyncInit = function () {
    FB.init({
      appId: '958384294182592',
      oauth: true,
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.3'
    })

    sAuth.fbAuthStatus()
  }

  $(function (d) {
    var js
    var id = 'facebook-jssdk'
    var ref = d.getElementsByTagName('script')[0]
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement('script')
    js.id = id
    js.async = true
    js.src = '//connect.facebook.net/en_US/sdk.js'
    ref.parentNode.insertBefore(js, ref)

  }(document))

}])

app.controller('loginController', ['$scope', 'facebookService', function ($scope, sAuth) {
  sAuth.isLogin()

  $scope.fbLogin = function () {
    console.log('Do login!')
    sAuth.fbLogin()
  }

}])

app.controller('homeController', ['$rootScope', '$scope', '$state', 'facebookService', function ($rootScope, $scope, $state, sAuth) {
  sAuth.isLogin()

  $scope.fbLogout = function () {
    console.log('Do logout!')
    sAuth.fbLogout()
  }

  $scope.fbGetPageList = function () {
    sAuth.fbGetPageList(function (response) {
      if (response && !response.error) {
        $rootScope.$apply(function () {
          $rootScope.user.pages = {}
          $rootScope.user.pages = response.data
        })
      }
    })
  }

}])

app.controller('pageController', ['$scope', '$stateParams', 'facebookService', function ($scope, $stateParams, sAuth) {
  $scope.currentPage = {}
  $scope.pageNotification = []
  $scope.init = function () {
    sAuth.fbGetNotification({
      id: $stateParams.pId,
      accessToken: $stateParams.access_token
    }, function (response) {
      console.log(response.notifications.data)
      $scope.$apply(function () {
        $scope.pageNotification = response.notifications.data
      })
    })

    sAuth.fbGetPageInformation({
      id: $stateParams.pId
    }, function (response) {
      console.log(response)
      $scope.$apply(function () {
        $scope.currentPage.name = response.name
      })
    })
  }
}])
