/**
 * Service Module
 *
 * All service is here.
 */
/* global angular */
/* global FB */
var service = angular.module('Service', [])

service.factory('facebookService', ['$rootScope', '$state', function ($rootScope, $state) {
  this.user = {}

  var goPageList = function () {
    $state.go('page', {})
  }

  var goLoginPage = function () {
    $state.go('login', {})
  }

  var fbUserInfo = function (callback) {
    FB.api('/me', function (res) {
      $rootScope.$apply(function () {
        $rootScope.user = this.user = res
        callback()
      })
    })
  }

  var fbAuthStatus = function () {
    FB.Event.subscribe('auth.authResponseChange', function (res) {
      if (res.status === 'connected') {
        $rootScope.accessToken = res.authResponse.accessToken
        fbUserInfo(goPageList)
      } else {
        goLoginPage()
      }
    })
  }

  var fbLogout = function () {
    FB.logout(function (response) {
      $rootScope.$apply(function () {
        $rootScope.user = this.user = null
      })
    })
  }

  var fbLogin = function () {
    FB.login(function (response) {
      console.log('Do login!')
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ')
        $rootScope.access_token = response.authResponse.accessToken
        fbUserInfo(goPageList)
      } else {
        console.log('User cancelled login or did not fully authorize.')
      }
    }, {
      scope: 'public_profile,email,manage_pages'
    })
  }

  var fbCheckAuth = function () {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        goPageList()
      } else if (response.status === 'not_authorized') {
        goLoginPage()
      } else {
        goLoginPage()
      }
    }, true)
  }

  var isLogin = function () {
    if ($rootScope.user != null) {
      goPageList()
    } else {
      goLoginPage()
    }
  }

  var fbGetPageList = function (callback) {
    fbAPI({
      path: 'me/accounts',
      variable: {
        fields: 'id,name,access_token',
        limits: '250'
      }
    }, callback)
  }

  var fbGetNotification = function (params, callback) {
    fbAPI({
      path: params.id,
      variable: {
        fields: 'notifications.include_read(true)',
        limits: '250',
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbAPI = function (params, callback) {
    FB.api(params.path, params.variable, callback)
  }

  return {
    fbAuthStatus: fbAuthStatus,
    fbUserInfo: fbUserInfo,
    fbLogin: fbLogin,
    fbLogout: fbLogout,
    fbCheckAuth: fbCheckAuth,
    isLogin: isLogin,
    fbGetPageList: fbGetPageList,
    fbGetNotification: fbGetNotification
  }
}])
