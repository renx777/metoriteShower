


var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height =900 - margin.top - margin.bottom,
    width = 1200 - margin.left - margin.right,
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
  
   var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var data=meteors.features;
    // tooltip mouseover event handler
    var tipMouseover = function(data) {
     console.log(data.properties)
      //var color = colorScale(d.manufacturer);
      var color = "black";
      var html =
        "<span>Mass:" + data.properties.mass  +"</span><br/>" +
         "<span>Fall:" + data.properties.fall  +"</span><br/>" +   
          "<span>Name:" + data.properties.name  +"</span><br/>"  +
           "<span>Year:" + data.properties.year  +"</span><br/>" +
           "<span>Class:" + data.properties.recclass  +"</span><br/>" 
        
          ;

      tooltip
        .html(html)
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 28 + "px")
        .transition()
        .duration(200) // ms
        .style("opacity", 0.9); // started as 0!
    };
    // tooltip mouseout event handler
    var tipMouseout = function(data) {
     
      tooltip
        .transition()
        .duration(300) // ms
        .style("opacity", 0); // don't care about position!
    };

  
  //draw circles for meteros
  
  svg.selectAll(".meteors")
     .data(meteors.features)
     .enter().append("circle")
  .attr("class", "circle")
      .attr("r",function(d){
    
     var range = 718750/2/2;
    
        if (d.properties.mass <= range) return 2;
        else if (d.properties.mass <= range*2) return 10;
        else if (d.properties.mass <= range*3) return 20;
        else if (d.properties.mass <= range*20) return 30;
        else if (d.properties.mass <= range*100) return 40;
        return 50;
       
    
    

  }
           
           
           )
  
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
  .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout)
  .attr("fill", function(d) {
    
    var group=Math.floor((Math.random() * 10) + 1);
    
    return color(group)});
  
 
  
  
  
}








// zoom and pan
svg.call(d3.zoom().on("zoom", function () {
  d3.event.transform.x = Math.min(0, Math.max(d3.event.transform.x, width - width * d3.event.transform.k));
  d3.event.transform.y = Math.min(0, Math.max(d3.event.transform.y, height - height * d3.event.transform.k));
  svg.attr("transform", d3.event.transform);
}));


d3.select(self.frameElement).style("height", height + "px");