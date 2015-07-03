/**
* sellsukiController Module
*
* App Controller
*/
/* global angular */
var control = angular.module('sellsukiController', [])

control.controller('loginController', ['$scope', 'facebookService', function ($scope, sAuth) {
  $scope.fbLogin = function () {
    console.log('Do login!')
    sAuth.fbLogin()
  }

}])

control.controller('homeController', ['$rootScope', '$scope', '$state', 'facebookService', function ($rootScope, $scope, $state, sAuth) {
  $scope.fbLogout = function () {
    console.log('Do logout!')
    sAuth.fbLogout()
  }

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

control.controller('appController', ['$scope', '$stateParams', 'facebookService', function ($scope, $stateParams, fbService) {
  $scope.notificationList = []

  $scope.fbLogout = function () {
    console.log('Do logout!')
    fbService.fbLogout()
  }

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

control.controller('pageController', ['$scope', '$stateParams', '$q', 'facebookService', function ($scope, $stateParams, $q, sAuth) {
  $scope.currentObj = {}
  $scope.pageObjs = []

  $scope.getFullComment = function (objId, callback) {
    sAuth.fbGetFullComment({
      objId: objId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
      console.log(response)
      callback(response.comments.data)
    })
  }

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

control.controller('likeController', ['$scope', 'facebookService', function ($scope, fbService) {
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

control.controller('commentObj', ['$scope', 'facebookService', function ($scope, fbService) {
  $scope.newComment = []
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

control.controller('replyMessage', ['$scope', 'facebookService', function ($scope, fbService) {
  $scope.newReply = []

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

control.directive('notiListTemp', ['facebookService', function (fService) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attr) {
      return 'templates/' + attr.type + '.noti.tmpl.html'
    }
  }
}])

control.directive('commentTemp', ['facebookService', function (fService) {
  return {
    restrict: 'E',
    templateUrl: 'templates/comment.tmpl.html'
  }
}])
