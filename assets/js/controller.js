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

  var fbNotification = function () {
    sAuth.fbGetPageNotification({
      pageId: $stateParams.pId,
      accessToken: $scope.currentPage.accessToken
    }, function (response) {
      var objList = []

      angular.forEach(response.notifications.data, function (value, key) {
        if (value.application.id !== '2409997254' && value.application.id !== '2530096808') {
          var defferred = $q.defer()
          console.log(value.object.id)
          sAuth.fbObject({
            objId: value.object.id,
            accessToken: $scope.currentPage.accessToken
          }, function (result) {
            console.log(result)
            defferred.resolve(result)
          })
          objList.push(defferred.promise)
        }
      })

      $q.all(objList).then(function (res) {
        if (res && !res.error) {
          $scope.pageObjs = res
        }
      })
    })
  }

  $scope.init = function () {
    sAuth.fbGetPageInformation({
      pageId: $stateParams.pId
    }, function (response) {
      $scope.$apply(function () {
        $scope.currentPage.accessToken = response.access_token
        $scope.currentPage.name = response.name
      })
      fbNotification()
    })
  }
}])
