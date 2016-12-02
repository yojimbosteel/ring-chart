(function (angular) {
  "use strict";
  angular.module("RingWidgetModule")
    .directive("tcRing", tcRing);

  function tcRing($window) {
    var d3 = $window.d3;

    return {
      restrict: "E",
      require: "^^tcRingWidget",
      templateUrl: "tcRing.html",
      scope: {
        nameKey: "@",
        ringData: "@"
      },
      link: linkFunction
    };

    function linkFunction(scope, element, attrs, tcRingWidgetController){
      // Default attributes to use in template if attribute not set.
      var defaults = {
        width: 200,
        height: 200
      };

      scope.title = "Generic Title";

      console.log(scope.ringData);

      // Add ring to ring list on RingWidgetController
      tcRingWidgetController.addRing(scope);



      /************************************************************************
        Custom D3 ring chart

        Most everything here is going to be happening outside the AngularJS
      context so scope.$apply() will be necessary for forcing angular to go
      into it's digest loop when changes are made to the scope.

        dataset: Constructed from a data service passed-in by directive caller.
      Result is
      ************************************************************************/
      //Width and height
      var w = defaults.width;
      var h = defaults.height;

      var dataset = [270, 10, 30, 50]; //TODO: Replace with data factory that generates JSON objects.

      // Get sum and calc percent.
      function getSum(total, num){
        return total + num;
      }
      var toPercent = 1/dataset.reduce(getSum)*100;

      var outerRadius = Math.min(w,h)/2;
      var innerRadius = Math.min(w,h)/3;
      var cornerRadius = outerRadius*0.05;
      var arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)
              .cornerRadius(cornerRadius)
              .padAngle(0.03);

      var arcDataset = d3.pie()(dataset); // Convert array of number into arc object data

      function calcCenterRotation(datum){
        // Make selected data element centered on rhs of ring graph
        var elementAngle = datum["endAngle"] - datum["startAngle"];
        var elementCenterAngle = datum["startAngle"] + elementAngle/2;
        var rotateAngle = 2*Math.PI - elementCenterAngle + Math.PI/2;
        return rotateAngle;
      }

      /* rotateArcs: Takes a positive angle in radians and and d3ArcDataset and
      mutates the data. */
      function rotateArcs(d3ArcData, radRotation) {
        radRotation = Math.abs(radRotation);
        for(var i=0; i < d3ArcData.length; i++){
          var dTheta = d3ArcData[i]["endAngle"] - d3ArcData[i]["startAngle"];
          d3ArcData[i]["startAngle"] = (d3ArcData[i]["startAngle"] + radRotation)%(Math.PI*2);
          d3ArcData[i]["endAngle"] = d3ArcData[i]["startAngle"] + dTheta;
        }
      }

      // Normalize arc dataset
      rotateArcs(arcDataset, 0);
      // Make first data element centered on rhs of ring graph
      var rotateAngle = calcCenterRotation(arcDataset[0]);
      // Go through and rotate all arcs.
      rotateArcs(arcDataset, rotateAngle);

      function clickArc(){
        var selectedElement = d3.select(this);
        // var selectedElementDatum = selectedElement.datum();
        // var rotateBy = calcCenterRotation(selectedElementDatum);
        selectedElement.attr("fill", "green");
        scope.title = "New";
        scope.$apply();
        // rotateArcs(arcDataset, rotateBy);
        // arcs.data(arcDataset)
          // .select("path")
        var rings = d3.select(element[0])
          .select("g.rings");
        rings.transition().duration(1000)
          // .attr("d", arc);
          .attr("transform", "rotate(90 100 100)");
      }

      //Easy colors accessible via a 10-step ordinal scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      //Select SVG element from template
      var svg = d3.select(element[0])
            .select("div")
            .select("svg");

      //Set up groups
      var arcs = svg.append("g")
              .attr("class", "rings")
              .selectAll("g.arc")
              .data(arcDataset)
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");


      //percent
      function percentOnHover(d){
        var xPosition = outerRadius;
        var yPosition = outerRadius;
        svg.append("text")
          .attr("id", "percent-on-hover")
          .attr("x", xPosition)
          .attr("y", yPosition)
          .attr("dy", "0.3em")
          .text(Math.round(d.value*toPercent) + "%");
      }
      function removePercentOnMouseout(d){
        svg.select("#percent-on-hover")
          .remove();
      }

      //Draw arc paths
      arcs.append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("d", arc)
          .on("click", clickArc)
          .on("mouseover", percentOnHover)
          .on("mouseout", removePercentOnMouseout);

      //Labels
      arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.value;
          });
    }
  }
})(angular);
