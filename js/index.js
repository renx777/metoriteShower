


var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height =900 - margin.top - margin.bottom,
    width = 1400 - margin.left - margin.right,
    scale0 = (width - 1) / 2 / Math.PI;

var color = d3.scaleOrdinal(d3.schemeCategory10);
var svg = d3
.select("#map")
.append("svg")
.attr("height", height + margin.top + margin.bottom)
.attr("width", width + margin.left + margin.right)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// get the map co-ordinates from json file
d3
  .queue()
  .defer(d3.json, "https://unpkg.com/world-atlas@1/world/110m.json")
  .defer(d3.json,"https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
  .await(ready);

var projection = d3.geoMercator().translate([width / 2, height / 2])
                    .scale(200);

var path = d3.geoPath().projection(projection);


function ready(error, data,meteors) {
  
  var countries = topojson.feature(data, data.objects.countries).features;

  

  // add a path for each country
  //  shapes for each country
  //   shapes --> path

  svg
    .selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .on('mouseover',function(d){
    d3.select(this).classed("selected",true)
  })
    .on('mouseout',function(d){
    d3.select(this).classed("selected",false)
  })
  
  
  
  //draw circles for meteros
  
  svg.selectAll(".meteors")
     .data(meteors.features)
     .enter().append("circle")
  .attr("class", "circle")
      .attr("r",function(d){
    
    if(d.properties.mass>1000000){
      return 15
    }
       return 2
  })
  
      .attr("cx",function(d){
    
    if(d.geometry!=null){
       var coords=projection(d.geometry.coordinates)
      console.log(d)
       return coords[0]
    }
  })
  .attr("cy",function(d){
    if(d.geometry!=null){
       var coords=projection(d.geometry.coordinates)
      console.log(d)
       return coords[1]
    }
    
    
  })
  .attr("fill", function(d) {
    
    var group=Math.floor((Math.random() * 10) + 1);
    
    return color(group)});
  
 
  
  
  
}







 svg.call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))


d3.select(self.frameElement).style("height", height + "px");