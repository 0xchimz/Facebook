/**
 * Service Module
 *
 * All service is here.
 */
var service = angular.module('Service', [])

service.factory('facebookService', ['$rootScope', '$state', function ($rootScope, $state) {
  this.user = {}

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
      console.log(res)
      if (res.status === 'connected') {
        fbUserInfo(function () {
          $state.go('home', {})
        })
      } else {
        $state.go('login', {})
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
        access_token = response.authResponse.accessToken
        console.log(access_token)
        fbUserInfo(function () {
          $state.go('home', {})
        })
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
        $state.go('home', {})
      } else if (response.status === 'not_authorized') {
        $state.go('login', {})
      } else {
        $state.go('login', {})
      }
    }, true)
  }

  var isLogin = function () {
    if ($rootScope.user != null) {
      $state.go('home', {})
    } else {
      $state.go('login', {})
    }
  }

  var fbGetPageList = function () {
    FB.api('me/accounts', {
      fields: 'id,name,access_token',
      limit: '100'
    }, function (response) {
      if (response && !response.error) {
        console.log(response)
      }
    })
  }

  return {
    fbAuthStatus: fbAuthStatus,
    fbUserInfo: fbUserInfo,
    fbLogin: fbLogin,
    fbLogout: fbLogout,
    fbCheckAuth: fbCheckAuth,
    isLogin: isLogin,
    fbGetPageList: fbGetPageList
  }
}])
