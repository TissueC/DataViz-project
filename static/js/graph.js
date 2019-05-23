function refreshForce(data){

console.log(data);
var links=data;
var config = {
  'linkDistance': 60,
  'charge': -220,
  'gravity': 0.2,
  'offx':0,
  'offy':0
};

var width = 0.98*$("#part4").width(),
    height = 0.98*$("#part4").height();

console.log(width,height);
var color = d3.scale.category20();

// Compute nodes from links data (create new node if needed)
nodes={};
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = { name: link.source, group: 4, color:1+Math.floor(Math.random() * 20) });
    link.target = nodes[link.target] || (nodes[link.target] = { name: link.target, group: 2, color:1});
    link.value = link.value;
});


// Setup Canvas
d3.select('#part4').selectAll('svg').remove();

function zoomed() {
  console.log(node);
  console.log(link);
  node.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  link.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}





function redraw() {
  console.log("here", d3.event.translate, d3.event.scale);
  vis.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}



var svg = d3.select('#part4').append('svg')
    .attr('width',width)
    .attr('height', height)
    .attr("pointer-events", "auto");
   // .attr("transform","translate(200, 300)") 
  
var vis=svg.append('svg:g')
.call(d3.behavior.zoom().scaleExtent([0.2, 3]).on("zoom", redraw))
.on("dblclick.zoom", null)
.append('svg:g');

vis.append('svg:rect')
    .attr('width', width*5)
    .attr('height', height*5)
    .attr('fill', 'white')
    .attr('transform',"translate(-1000,-1000)")

// Draw Force Graph
var force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .charge(config.charge)
    .gravity(config.gravity)
    .on("tick", tick)
    .linkDistance(function(d){
      return d.value*2;
    }) // config.linkDistance
    .start();

// EDGES
var link = vis.selectAll('.link')
     .data(links)
     .enter().append('line')
     .attr('class', 'link');

var node = vis.selectAll('.node')
  .data(force.nodes())
  .enter()
  .append("g")
  .call(force.drag);


// ----------------------------------------------

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style('text-anchor','middle')
    .html(function (d) {
      if (d.group==2)
        return  "<center>"+d.name + "<br>点击查看详细履历以及生涯轨迹</center>";
      else return "<center>"+d.name+"<br>双击显示该类别所有成员</center>";
});

svg.call(tip)



// NODES


node.append("circle")
  .attr('class', 'node')
  .attr('r', function(d) { return d.group==2? 12:25; })
  .style("stroke", "transparent")
  .style("fill", function(d) { return color(d.color); })
  .on('dblclick', connectedNodes)
  .on('click',addItemInPart1)
  .on('mouseover', function(d){
      tip.show(d);
      console.log(d);
    })
    .on('mouseout', tip.hide);

node.append('text')
  .text(function(d){
    if (d.group==2)
      return '';
    else return ''+d.name;
  })
  .attr('dy',function(d){
    if (d.group==2) return '1.5em';
    else return '2.0em';
  })
  .style('opacity',function(d){
    if (d.group==2)
      return '0';
    else return '1';
  })
  .style('text-anchor',"middle")
  .style('fill','black')
  .style('font-size',function(d){
    if(d.group==2)
      return 0;
    else return '25px';
  });


// EVENT HANDLER
function tick(e) {

  node.attr("transform", function(d) { return "translate(" + (config.offx+d.x) + "," +(config.offy+ d.y) + ")"; });

  link.attr('x1', function(d) { return config.offx+d.source.x; })
      .attr('y1', function(d) { return config.offy+d.source.y; })
      .attr('x2', function(d) { return config.offx+d.target.x; })
      .attr('y2', function(d) { return config.offy+d.target.y; });

}

// ------------- UTILITY ------------------------------

//Toggle stores whether the highlighting is on
var toggle = 0;

//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
}

links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}

var intervalTimeForClick=null;
function connectedNodes() {
    clearTimeout(intervalTimeForClick);
    if (toggle === 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) { // If neighboring, keep opacity on.
            if (o.name === d.name) { return 1; }  // if node is the one being clickeds
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        })
        .selectAll('text').text(function(d){return ''+d.name;})
        .style("opacity",function(o){
            if (o.name === d.name) { return 1; }  // if node is the one being clickeds
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0;
        })
        .style('font-size',function(o){
          if (o.name === d.name) { return o.group==2? '15px':'25px'; }  // if node is the one being clickeds
          return neighboring(d, o) | neighboring(o, d) ? '15px' : 0;
        });
        //tip.show(d);
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });

        force.linkDistance(function(o){
           return 160;
        }).start();
        //Reduce the op
        toggle = 1;

    } else {
        //Put them back to opacity=1
        node.style("opacity", 1)
        .selectAll('text').text(function(o){
            if (o.group==2)
              return '';
            else return ''+o.name;
          })
        .style('font-size',function(o){
           return o.group==2? '15px':'25px'; // if node is the one being clickeds
        })
        .style('opacity',function(d){
          if (d.group==2)
            return '0';
          else return '1';
        });
        force.linkDistance(function(d){
           return 60;
        }).start();

        link.style("opacity", 0.3);
        toggle = 0;
    }
}

function addItemInPart1() {
  clearTimeout(intervalTimeForClick);
  d=d3.select(this).node().__data__;
  if (d.group==2){
    intervalTimeForClick = setTimeout(function(){
      nameList.push(d.name);
      refreshChart();
    },300);
    }
  }

}


$(document).ready(function(){

  $("label[for=province]").css('background-color','yellow');
  $.post("/force", {label:'province'}, 
        function(data, status){
          refreshForce(data);
        });
  $("input[name='forceOption']").change(function(){
    console.log(this.id);
    $(".choice1-label").css("background-color","white");
    $("label[for="+this.id+"]").css("background-color","yellow");
    $.post("/force", {label:this.id}, 
        function(data, status){
          refreshForce(data);
        });
  });
  
});
