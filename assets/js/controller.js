/* global angular */
var control = angular.module('sellsukiController', [])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name loginController
 *
 * @param $scope {service} controller scope
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('loginController', ['$scope', 'facebookService', function ($scope, sAuth) {
  /**
  * Control login flow in application
  * @memberof loginController
  * @function fbLogin
  */
  $scope.fbLogin = function () {
    console.log('Do login!')
    sAuth.fbLogin()
  }

}])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name homeController
 *
 * @param $rootScope {service} Root Controller Scope
 * @param $scope {service} controller scope
 * @param $state {service} Route for Application
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('homeController', ['$rootScope', '$scope', '$state', 'facebookService', function ($rootScope, $scope, $state, sAuth) {
  /**
  * Logout from Facebook service
  * @memberof homeController
  * @function fbLogout
  */
  $scope.fbLogout = function () {
    console.log('Do logout!')
    sAuth.fbLogout()
  }
  /**
  * Get app page list of the account
  * @memberof homeController
  * @function fbGetPageList
  */
  $scope.fbGetPageList = function () {
    sAuth.isLogin()
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
/**
 * @memberof Controller
 * @ngdoc controller
 * @name appController
 *
 * @param $scope {service} controller scope
 * @param $stateParams {service} State Control
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('appController', ['$scope', '$stateParams', 'facebookService', function ($scope, $stateParams, fbService) {
  $scope.notificationList = []
  /**
  * Logout from Facebook service
  * @memberof appController
  * @function fbLogout
  */
  $scope.fbLogout = function () {
    console.log('Do logout!')
    fbService.fbLogout()
  }
  /**
  * Init application page
  * @memberof appController
  * @function init
  */
  $scope.init = function () {
    fbService.fbGetPageInformation({
      pageId: $stateParams.pId
    }, function (response) {
      $scope.$apply(function () {
        $scope.currentPage = response
      })
      fbGetNotificationList()
    })
  }
  /**
  * Get all notification list
  * @memberof appController
  * @function fbGetNotificationList
  */
  var fbGetNotificationList = function () {
    fbService.fbGetPageNotification({
      pageId: $stateParams.pId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
      angular.forEach(response.notifications.data, function (value, key) {
        if (value.application.id !== '2409997254' && value.application.id !== '2530096808') {
          $scope.$apply(function () {
            $scope.notificationList.push(value)
          })
        }
      })
    })
  }
}])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name pageController
 *
 * @param $scope {service} Controller scope
 * @param $stateParams {service} State control
 * @param $q {service} Promises
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('pageController', ['$scope', '$stateParams', '$q', 'facebookService', function ($scope, $stateParams, $q, sAuth) {
  $scope.currentObj = {}
  $scope.pageObjs = []
  /**
  * Get all comment of Obj
  * @memberof pageController
  * @function getFullComment
  */
  $scope.getFullComment = function (objId, callback) {
    sAuth.fbGetFullComment({
      objId: objId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
      console.log(response)
      callback(response.comments.data)
    })
  }
  /**
  * Init Page to show all comment
  * @memberof pageController
  * @function init
  */
  $scope.init = function () {
    sAuth.fbObject({
      objId: $stateParams.objId,
      accessToken: $scope.currentPage.access_token
    }, function (result) {
      $scope.getFullComment(result.id, function (res) {
        result.comments = res
        $scope.$apply(function () {
          $scope.pageObjs = result
        })
      })
    })
  }
}])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name likeController
 *
 * @param $scope {service} Controller scope
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('likeController', ['$scope', 'facebookService', function ($scope, fbService) {
  /**
  * Do like something
  * @memberof likeController
  * @function doLike
  */
  $scope.doLike = function (comment) {
    if (comment.id === '') return
    if (comment.user_likes) {
      fbService.fbLike({
        objId: comment.id,
        method: 'DELETE',
        accessToken: $scope.currentPage.access_token
      }, function (res) {console.log(res)})
    } else {
      fbService.fbLike({
        objId: comment.id,
        method: 'POST',
        accessToken: $scope.currentPage.access_token
      }, function (res) {console.log(res)})
    }
    comment.user_likes = !comment.user_likes
  }
}])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name commentObj
 *
 * @param $scope {service} Controller scope
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('commentObj', ['$scope', 'facebookService', function ($scope, fbService) {
  $scope.newComment = []
  /**
  * Send a comment to Facebook
  * @memberof commentObj
  * @function sendComment
  */
  $scope.sendComment = function (commentId) {
    console.log(commentId)
    var tmp = {
      message: $scope.commentMessage,
      from: {
        id: $scope.currentPage.id,
        name: $scope.currentPage.name
      },
      id: null,
      created_time: new Date()
    }
    var tmpMessage = $scope.commentMessage
    $scope.commentMessage = ''
    $scope.newComment.push(tmp)
    fbService.fbPostComment({
      commentId: commentId,
      message: tmpMessage,
      accessToken: $scope.currentPage.access_token
    }, function (res) {
      $scope.$apply(function () {
        tmp.id = res.id
      })
      console.log(res.id)
    })
  }
}])
/**
 * @memberof Controller
 * @ngdoc controller
 * @name replyMessage
 *
 * @param $scope {service} Controller scope
 * @param facebookService {service} Facebook Service
 *
 */
control.controller('replyMessage', ['$scope', 'facebookService', function ($scope, fbService) {
  $scope.newReply = []
  /**
  * Reply message of some comment
  * @memberof replyMessage
  * @function reply
  */
  $scope.reply = function (commentId) {
    console.log(commentId)
    var tmp = {
      message: $scope.replyMessage,
      from: {
        id: $scope.currentPage.id,
        name: $scope.currentPage.name
      },
      id: null,
      created_time: new Date()
    }
    var tmpMessage = $scope.replyMessage
    $scope.replyMessage = ''
    $scope.newReply.push(tmp)
    fbService.fbPostComment({
      commentId: commentId,
      message: tmpMessage,
      accessToken: $scope.currentPage.access_token
    }, function (res) {
      $scope.$apply(function () {
        tmp.id = res.id
      })
      console.log(res)
    })
  }
}])
/**
 * @memberof Directive
 * @ngdoc directive
 * @name notiListTemp
 *
 * @param facebookService {service} Facebook Service
 * @description Return type of notification
 * @example 
 * <div class="row notification">
 * <div class="content">
 *  <div class="media">
 *    <div class="media-left">
 *       <a ng-href="{{currentPage.link}}" target="_bank">
 *         <img class="media-object" ng-src="{{currentPage.photos.data[0].picture}}" width="45px" height="45px" />
 *       </a>
 *     </div>
 *     <div class="media-body">
 *       <h4 class="media-heading"><a ng-href="http://www.facebook.com/{{currentPage.id}}" target="_bank">{{currentPage.name}}</a></h4>
 *      <small>{{pageObjs.created_time}}</small>
 *     </div>
 *   </div>
 *   <div class="status-message"><p style="white-space: pre;">{{pageObjs.message}}</p></div>
 * </div>
 * <comment-temp></comment-temp>
 *</div>
 */
control.directive('notiListTemp', ['facebookService', function (fService) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attr) {
      return 'templates/' + attr.type + '.noti.tmpl.html'
    }
  }
}])
/**
 * @memberof Directive
 * @ngdoc directive
 * @name commentTemp
 *
 * @param facebookService {service} Facebook Service
 * @return template comment.tmpl.html
 */
control.directive('commentTemp', ['facebookService', function (fService) {
  return {
    restrict: 'E',
    templateUrl: 'templates/comment.tmpl.html'
  }
}])
