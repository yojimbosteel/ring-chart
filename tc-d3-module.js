(function(angular){
  "use strict";
  var app = angular.module("TcD3Directives", []);

  app.directive("tcBinRingWidget", function(){
    return {
      restrict: "E",
      transclude: true,
      templateU
      scope: {},
      link: function(scope, element, attrs){

      }
    };
  });

  app.directive("tcBinRing", function(){
    return {
      restrict: "E",
      scope: {},
      link: function(scope, element, attrs){

      }
    }
  });

  app.directive("tcBinRingFilter", function(){
  });
})(angular);
