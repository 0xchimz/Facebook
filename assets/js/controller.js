/**
* sellsukiController Module
*
* App Controller
*/
/* global angular */
var control = angular.module('sellsukiController', [])

control.controller('loginController', ['$scope', 'facebookService', function ($scope, sAuth) {
  sAuth.isLogin()

  $scope.fbLogin = function () {
    console.log('Do login!')
    sAuth.fbLogin()
  }

}])

control.controller('homeController', ['$rootScope', '$scope', '$state', 'facebookService', function ($rootScope, $scope, $state, sAuth) {
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

control.controller('pageController', ['$scope', '$stateParams', '$q', 'facebookService', function ($scope, $stateParams, $q, sAuth) {
  $scope.currentPage = {}
  $scope.pageObjs = []
  $scope.fromData = {}

  var fbNotification = function () {
    sAuth.fbGetPageNotification({
      pageId: $stateParams.pId,
      accessToken: $scope.currentPage.access_token
    }, function (response) {
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
          $scope.pageObjs = res
        }
      })
    })
  }

  $scope.getFullComment = function (objId, callback) {
    sAuth.fbGetFullComment({
      objId: objId,
      accessToken: $scope.access_token
    }, function (response) {
      var tmpListComment = {}
      angular.forEach(response.comments.data, function (value, key) {
        if (tmpListComment[value.from.id] === undefined) {
          tmpListComment[value.from.id] = {}
          tmpListComment[value.from.id].comments = []
        }
        tmpListComment[value.from.id].comments.push(value)
        callback(tmpListComment)
      })
    })
  }

  $scope.init = function () {
    sAuth.fbGetPageInformation({
      pageId: $stateParams.pId
    }, function (response) {
      $scope.$apply(function () {
        $scope.currentPage = response
      })
      fbNotification()
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
