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
        ringData: "@",
        title: "@"
      },
      link: linkFunction
    };

    function linkFunction(scope, element, attrs, tcRingWidgetController){
      // Default attributes to use in template if attribute not set.
      var defaults = {
        width: 200,
        height: 200
      };

      scope.title = scope.title || "Some title from data-set.";

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

      var dataset = [50, 20]; //TODO: Replace with data factory that generates JSON objects.

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

      function clickArc(datum){
        var selectedElement = d3.select(this);
        selectedElement.attr("fill", "green");
        scope.title = "New";
        scope.$apply();
      }

      function doubleClickArc(datum){
        var rings = d3.select(element[0])
          .select("g.rings");
        svg.selectAll("g.arc")
          .classed("selected", false);
        d3.select(this)
          .classed("selected", true);
        rings.transition().duration(1000)
          .attrTween("transform", tween);

        function tween(){
          var rotateAngle = calcCenterRotation(datum)*180/Math.PI;
          var interpolateFrom = this.getAttribute("transform") || "rotate(0, 100, 100)";
          return d3.interpolateString(interpolateFrom, "rotate(" + rotateAngle +  ", 100, 100)");
        }
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
              .classed("selected", function(d, i) {if(i==0){return true;}})
              .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
              .on("click", clickArc)
              .on("dblclick", doubleClickArc)
              .on("mouseover", percentOnHover)
              .on("mouseout", setInitialCenterText);

      //Add initial center percent text
      function setInitialCenterText(){
        svg.select("text.center")
          .remove();
        var data = d3.select("g.arc.selected").datum();
        svg.append("text")
          .attr("class", "center")
          .attr("x", outerRadius)
          .attr("y", outerRadius)
          .attr("dy", "0.3em")
          .text(Math.round(data.value*toPercent) + "%");
      }

      setInitialCenterText();

      //percent
      function percentOnHover(d){
        svg.select("text.center")
          .remove();
        svg.append("text")
          .attr("class", "center")
          .attr("x", outerRadius)
          .attr("y", outerRadius)
          .attr("dy", "0.3em")
          .text(Math.round(d.value*toPercent) + "%");
      }

      //Draw arc paths
      arcs.append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("d", arc);


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
