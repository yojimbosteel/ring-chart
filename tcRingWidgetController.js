(function(angular){
  "use strict";
  angular.module("RingWidgetModule")
    .controller("TcRingWidgetController", TcRingWidgetController);

  function TcRingWidgetController($scope){
    //   Use "this" for the controller object (sharred between directives)
    // and use $scope for the view of tcRingWidget
    var vm = this;
    // All the ring-charts contained by widget
    $scope.rings = [];

    $scope.ringData2 =
      {program:
        {
          bio:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 10
              }
            ],
          cr:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 10
              }
            ],
          plan:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 10
              }
            ]
        }
      };

    $scope.ringData3 =
      {program:
        {
          bio:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 50
              },
              {
                name: 'other',
                value: 50
              }
            ],
          cr:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 50
              },
              {
                name: 'other',
                value: 50
              }
            ],
          plan:
            [
              {
                name: 'billable',
                value: 100
              },
              {
                name: 'non-billable',
                value: 50
              },
              {
                name: 'other',
                value: 50
              }
            ]
        }
      };

    // Used by tcRingDirective linker to add rings to widget controller
    vm.addRing = function(ring){
      $scope.rings.push(ring);
    }
  }
})(angular);
