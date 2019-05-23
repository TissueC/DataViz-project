function lineData(d){
    // i'm assuming here that supplied datum 
    // is a link between 'source' and 'target'
    var points = [
        {lx: d.source.x, ly: d.source.y},
        {lx: d.target.x, ly: d.target.y}
    ];
    return line(points);
}

function translateAlong(path) {
  var l = path.getTotalLength();
    var ps = path.getPointAtLength(0);
    var pe = path.getPointAtLength(l);
    var angl = Math.atan2(pe.y - ps.y, pe.x - ps.x) * (180 / Math.PI) - 90;
    var rot_tran = "rotate(" + angl + ")";
  return function(d, i, a) {
    console.log(d);
    
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ") " + rot_tran;
    };
  };
}


function refreshMapArrow(coor,cv,mapName){
	placeNum=cv.length
	d3.select("#part3").select("svg").selectAll("g").remove();
	//d3.selectAll("[data-type=province]").style("fill","#aad5ff");
	//d3.selectAll("[data-type=city]").style("fill","#aad5ff");
	var svg = d3.select("#part3").select("svg").append("g");

	var line = d3.svg.line()
	                 .x( function(point) { return point.lx; })
	                 .y( function(point) { return point.ly; });

	var path = svg.append("path")
	.data([{source: {x : 0, y : 0}, target: {x : 500, y : 100}}])
    .attr("class", "mapLine")
	   //.style("marker-end", "url(#arrow)")
    .attr("d", coor)
    .style('stroke','black')
    .style('stroke-dasharray',5.5)
    .style('fill','none');
//var arrow = svg.append("svg:path")
	//.attr("d", "M2,2 L2,11 L10,6 L2,2");
	var arrow = svg.append("svg:path")
		.attr("d", d3.svg.symbol().type("diamond")).style('fill','yellow').style('stroke','yellow');



	  arrow.transition()
	      .duration(1000*(placeNum-1))
	      .ease("linear")
	      .attrTween("transform", translateAlong(path.node()));


// Returns an attrTween for translating along the specified path element.


	var totalLength = path.node().getTotalLength();


	var cvText=svg.append("g")
		.attr('class','cv-text')
	cvText.selectAll("text")
	.data(cv)
	.enter()
	.append("text")
	.attr("x",490).attr("y",function(d,i){
		return 130+20*i;
	})
	.style('font-size','15px')
	.text(function(d,i){
		return d.year+':'+d.city;
	});




	var legend=svg.append('g')
	.attr('class','map-legend');


	 legend.append("svg:path")
		.attr("d", d3.svg.symbol().type("diamond").size("400"))
		.style('fill','yellow').style('stroke','yellow')
		 .attr("transform","translate(100,270)");
	 
	 legend.append("svg:path")
    .attr("d","M100,300 L100,340" )
    .style('stroke','black')
    .style('stroke-width',5)
    .style('stroke-dasharray',5.5)
    .style('fill','none');

    legend.append("circle")
    .attr('r',5)
    .attr('cx',100)
    .attr('cy',370)
    .style('fill','black')

    legend.append("text")
    .attr('x',50).attr('y',276)
    .text('委员：');

    legend.append("text")
    .attr('x',20).attr('y',325)
    .text('升迁轨迹：');

    legend.append('text')
    .attr('x',20).attr('y',375)
    .text('工作城市：');

    legend.append('text')
    .attr('x',250).attr('y',60)
    .text(mapName)
    .style('font-size',120/mapName.length+'px');

/*
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000*(placeNum-1))        
      .ease("linear")  
      .attr("stroke-dashoffset", 0);
      */

}



function getCoor(placeList){
	coor_res='M'
	for(var i=0;i<placeList.length;i++)
	{
		var selector2=d3.selectAll("[data-name="+placeList[i].city+"]")
		coor=selector2.attr('d');
		if(selector2.attr('data-type')=='city'){
			coor=coor.slice(1,coor.indexOf('m'));
		
		}
		else{
			coor=coor.slice(1,coor.indexOf('L'));
		}
		console.log(coor);
		coor_res=coor_res+coor+' L';
	}
	coor_res=coor_res.slice(0,-1);
	console.log(coor_res);
	return coor_res;
}


$(function() {
	    $.D3Map({
	        selector: "#part3",
	        geoJSON: geoJSON,
	        change: function(data) {
	            console.dir(data);
	        }
	    });
	    
});

var placeList=[];
var yearList=[];

function showProvince(){
		for (var placeIndex=0;placeIndex<placeList.length;placeIndex++){
		console.log(placeList[placeIndex].city);
		 prov=d3.selectAll("[data-name="+placeList[placeIndex].city+"]").attr('data-province');

		 d3.selectAll("[data-province="+prov+"]")
	                .attr("data-selected", "true")
	                .transition()
	                .style("fill", "#e32f02")
	                .duration(1000)
	                .ease("bounce");
	            }
	     for (var placeIndex=0;placeIndex<placeList.length;placeIndex++){    
	     d3.selectAll("[data-name="+placeList[placeIndex].city+"]")
			 		.attr("data-selected", "true")
	                .transition()
	                .style("fill", "black")
	                .duration(1000)
	                .ease("bounce");
	   
	    // d3.selectAll(['data-selected=true']).attr('data-selected','false');
	}
}


var int=null;

function refreshMap(mapName){
	placeList=[];
	$.post("/track", {"Name": mapName}, 
            function(data, status){
            	console.log(data);
                placeList=data;
                
                var coor=getCoor(placeList);
                if(int!=null){d3.select("#part3").select("svg").selectAll("g").remove(); clearInterval(int);}
                refreshMapArrow(coor,data,mapName);
                int=setInterval(function(){refreshMapArrow(coor,data,mapName);},1000*placeList.length);
                d3.selectAll("[data-selected='true']").attr('data-selected','false').style("fill","#aad5ff");
				showProvince();
            });
	
}