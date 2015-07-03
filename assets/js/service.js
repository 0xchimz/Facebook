/**
 * Service Module
 *
 * All service is here.
 */
/* global angular */
/* global FB */
var service = angular.module('sellsukiService', [])

service.factory('facebookService', ['$rootScope', '$state', function ($rootScope, $state) {
  this.user = {}
  this.currentPage = null

  var setCurrentPage = function (page) {
    this.currentPage = page
  }

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
        $rootScope.accessToken = this.accessToken = res.authResponse.accessToken
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
      scope: 'public_profile,email,manage_pages,publish_pages'
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
        fields: 'id,name,unread_notif_count',
        limits: '250'
      }
    }, callback)
  }

  var fbGetPageNotification = function (params, callback) {
    fbAPI({
      path: params.pageId,
      variable: {
        fields: 'notifications.include_read(true){updated_time,object,title,application}',
        limits: '250',
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbGetPageInformation = function (params, callback) {
    fbAPI({
      path: params.pageId,
      variable: {
        fields: 'name,access_token,photos,link,description,about'
      }
    }, callback)
  }

  var fbObject = function (params, callback) {
    fbAPI({
      path: params.objId,
      variable: {
        access_token: params.accessToken,
        metadata: '1'
      }
    }, callback)
  }

  var fbGetFullComment = function (params, callback) {
    fbAPI({
      path: params.objId,
      variable: {
        fields: 'comments.order(chronological){comments,message,from,created_time,comment_count,user_likes}',
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbUserProfile = function (params, callback) {
    fbAPI({
      path: params.userId,
      variable: {
        fields: 'id,name,picture,link',
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbPostComment = function (params, callback) {
    fbAPI({
      path: '/' + params.commentId + '/comments',
      method: 'POST',
      variable: {
        message: params.message,
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbGetComment = function (params, callback) {
    fbAPI({
      path: params.commentId
    }, callback)
  }

  var fbLike = function (params, callback) {
    fbAPI({
      path: params.objId + '/likes',
      method: params.method,
      variable: {
        access_token: params.accessToken
      }
    }, callback)
  }

  var fbAPI = function (params, callback) {
    FB.api(params.path, params.method, params.variable, callback)
  }

  return {
    fbAuthStatus: fbAuthStatus,
    fbUserInfo: fbUserInfo,
    fbLogin: fbLogin,
    fbLogout: fbLogout,
    fbCheckAuth: fbCheckAuth,
    isLogin: isLogin,
    fbGetPageList: fbGetPageList,
    fbGetPageNotification: fbGetPageNotification,
    fbGetPageInformation: fbGetPageInformation,
    fbObject: fbObject,
    setCurrentPage: setCurrentPage,
    fbGetFullComment: fbGetFullComment,
    fbUserProfile: fbUserProfile,
    fbPostComment: fbPostComment,
    fbGetComment: fbGetComment,
    fbLike: fbLike
  }
}])
