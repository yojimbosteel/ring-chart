(function (angular) {
  "use strict";
  angular.module("RingWidgetModule")
    .directive("tcRingWidget", tcRingWidget);

  function tcRingWidget() {
    return {
      restrict: "E",
      transclude: true,
      templateUrl: "tcRingWidget.html",
      scope: {},
      controller: "TcRingWidgetController"
    };
  }
})(angular);
