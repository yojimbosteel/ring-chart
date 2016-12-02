(function(angular){
  "use strict";
  angular.module("App")
    .controller("AppController", AppController);

  function AppController($scope, $rootScope){
    $scope.viewData = "Let's test out D3!";
    $scope.defaultWidth = 300;
    $scope.defalutHeight = 300;
  }
})(angular);
