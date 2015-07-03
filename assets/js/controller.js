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
      var objList = {}
      angular.forEach(response.notifications.data, function (value, key) {
        if (value.application.id !== '2409997254' && value.application.id !== '2530096808' && objList[value.object.id] === undefined) {
          objList[value.object.id] = value
        }
      })
      $scope.$apply(function () {
        angular.forEach(objList, function (value, key) {
          $scope.notificationList.push(value)
        })
      })
    })
  }
}])

control.controller('pageController', ['$scope', '$stateParams', '$q', 'facebookService', function ($scope, $stateParams, $q, sAuth) {
  $scope.currentObj = {}
  $scope.pageObjs = []

  var fbNotification = function () {
    sAuth.fbGetPageNotification({
      pageId: $stateParams.pId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
      console.log(response)
      var objList = {}
      angular.forEach(response.notifications.data, function (value, key) {
        if (value.application.id !== '2409997254' && value.application.id !== '2530096808' && objList[value.object.id] === undefined) {
          var defferred = $q.defer()
          sAuth.fbObject({
            objId: value.object.id,
            accessToken: $scope.currentPage.access_token
          }, function (result) {
            $scope.getFullComment(result.id, function (res) {
              result.comments = res
              defferred.resolve(result)
            })
          })
          objList[value.object.id] = defferred.promise
        }
      })

      $q.all(objList).then(function (res) {
        if (res && !res.error) {
          angular.forEach(res, function (value, key) {
            $scope.pageObjs.push(value)
          })
        }
      })
    })
  }

  $scope.getFullComment = function (objId, callback) {
    sAuth.fbGetFullComment({
      objId: objId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
      console.log(response)
      callback(response.comments.data)
    // var tmpListComment = {}
    // angular.forEach(response.comments.data, function (value, key) {
    //   if (tmpListComment[value.from.id] === undefined) {
    //     tmpListComment[value.from.id] = {}
    //     tmpListComment[value.from.id].comments = []
    //   }
    //   tmpListComment[value.from.id].comments.push(value)
    //   callback(tmpListComment)
    // })
    })
  }

  $scope.init = function () {
    // sAuth.fbGetPageInformation({
    //   pageId: $stateParams.notiId
    // }, function (response) {
    //   $scope.$apply(function () {
    //     $scope.currentPage = response
    //   })
    //   fbNotification()
    // })
    sAuth.fbObject({
      objId: $stateParams.objId,
      accessToken: $scope.currentPage.access_token
    }, function (result) {
      $scope.getFullComment(result.id, function (res) {
        result.comments = res
        console.log(result)
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

control.controller('replyMessage', ['$scope', 'facebookService', function ($scope, fbService) {
  $scope.newReply = []
  $scope.reply = function (commentId, list) {
    var tmp = {
      message: $scope.replyMessage,
      from: {
        id: $scope.currentPage.id,
        name: $scope.currentPage.name
      },
      id: '',
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
      tmp.id = res.id
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
