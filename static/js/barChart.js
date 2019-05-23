var data_degree=[{
    name: '本科以下',
    value: 14
}, {
    name: '学士',
    value: 50
}, {
    name: '硕士',
    value: 58
}, {
    name: '博士',
    value: 61
}, {
    name: '教授',
    value: 2
}, {
    name: '院士',
    value: 4
}, {
    name: '军人',
    value: 15
}];

var data_race=[{
    name: '汉族',
    value: 188
}, {
    name: '壮族',
    value: 2
}, {
    name: '回族',
    value: 2
}, {
    name: '蒙古族',
    value: 3
}, {
    name: '维吾尔族',
    value: 2
}, {
    name: '满族',
    value: 1
}, {
    name: '藏族',
    value: 2
}, {
    name: '锡伯族',
    value: 1
}, {
    name: '苗族',
    value: 1
}, {
    name: '哈萨克族',
    value: 1
}, {
    name: '白族',
    value: 1
}];


var data_sex=[{
    name: '男',
    value: 194
}, {
    name: '女',
    value: 10
}];

var data_age=[{
    name: '1950',
    value: 6
}, {
    name: '1951',
    value: 2
}, {
    name: '1952',
    value: 2
}, {
    name: '1953',
    value: 12
}, {
    name: '1954',
    value: 17
}, {
    name: '1955',
    value: 33
}, {
    name: '1956',
    value: 27
}, {
    name: '1957',
    value: 31
}, {
    name: '1958',
    value: 15
}, {
    name: '1959',
    value: 13
}, {
    name: '1960',
    value: 12
}, {
    name: '1961',
    value: 5
}, {
    name: '1962',
    value: 10
}, {
    name: '1963',
    value: 7
}, {
    name: '1964',
    value: 9
}, {
    name: '1965',
    value: 0
}, {
    name: '1966',
    value: 0
}, {
    name: '1967',
    value: 1
}, {
    name: '未知',
    value: 2
}];


function SproutChart(target, options) {
    "use strict";

    var sc = this;

    options = Array.isArray(options) ? {
        data: options
    } : options || {};

    sc.data = options.data || [
            {name: 'Kevin', value: 8},
            {name: 'Bob', value: 8},
            {name: 'Stuart', value: 3},
            {name: 'Gru', value: 5}
        ];
    sc.size = options.size || 360; // svg container size, idealy equals to twice of rHover + max(spaceHover, spaceActive)
    sc.duration = options.duration || 1000; // transition duration of the first time draw the pie chart
    sc.easing = options.easing || 'cubic-in-out'; // transition easing function, same as d3 easing
    sc.materialColor = [
        '#f44336', ' #e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'
    ];

    var ri = Math.floor(Math.random() * sc.materialColor.length);
    sc.materialColor = sc.materialColor.slice(ri).concat(sc.materialColor.slice(0, ri));

    // create the svg container
    d3.select(target).selectAll('svg').remove();
    sc.svg = d3.select(target)
        .append('svg')
        .attr('width', 520)
        .attr('height', 280);

    return sc;
}

// create pie chart
SproutChart.prototype.pieChart = function(options) {
    var sc = this;
    sc.type = 'pie';

    options = options || {};

    var r = options.r || 150, // radius of pie chart
        innerRadius = options.innerRadius || 80, // the radius of the donut pie inner space
        rHover = options.rHover || 160, // radius of pie chart when hover
        spaceHover = options.spaceHover || 10, // the space pie pop out when hover
        spaceActive = options.spaceActive || 20, // the space pie pop out when active
        showOnStart = options.showOnStart !== undefined ? options.showOnStart : true; // call transitionForward() on start


    // function to draw arc
    var drawArc = function(startAngle, endAngle, outerRadius) {
        return d3.svg.arc()
            .startAngle(startAngle)
            .endAngle(endAngle)
            .innerRadius(innerRadius)
            .outerRadius(outerRadius || r);
    };

    // map data to arc function
    var sum = sc.data.map(function(d) {
        return d.value;
    }).reduce(function(prev, cur) {
        return prev + cur;
    });
    var accumulate = 0;
    sc.data = sc.data.map(function(d, i) {
        return {
            name: d.name,
            value: d.value,
            color: d.color || sc.materialColor[i],
            arc: drawArc(accumulate, accumulate += d.value / sum * 2 * Math.PI)
        };
    });


    var g = sc.svg.append('g')
        .attr('class', 'pie');


    sc.svg.selectAll('.pie-legend').remove();
    var legend=sc.svg.append('g')
        .attr('class','pie-legend');

    legend.selectAll("rect")
    .data(sc.data)
    .enter()
    .append("rect")
    .attr('x',400)
    .attr('y',function(d,i){return 150/sc.data.length+ i*15;})
    .attr('width',40)
    .attr('height',15)
    .style('fill',function(d){return d.color;})

    legend.selectAll('text')
    .data(sc.data)
    .enter()
    .append("text")
    .attr('x',455)
    .attr('y',function(d,i){return 150/sc.data.length+i*15+12;})
    .style('fill',function(d){return d.color;})
    .style('font-size',"13px")
    .text(function(d){return d.name})
    // place the svg container
    g.attr('transform', 'translate(' + (options.offx+sc.size / 2) + ', ' + (options.offy+sc.size / 2) + ')');

    // draw for each pie
    var pie = g.selectAll('path')
        .data(sc.data)
        .enter().append('path')
        .style('fill', function(d) {
            return d.color;
        })
        .attr('d', function(d) {
            return drawArc(d.arc.startAngle()(), d.arc.endAngle()())();
        })
        .style('clip-path', 'url(#clipMask)');

    pie.on('mouseover', function(d) {
        if (!d.active) {
            d3.select(this)
                .transition().duration(200).ease(sc.easing)
                .attr('d', function() {
                    return drawArc(d.arc.startAngle()(), d.arc.endAngle()(), rHover)();
                })
                .attr('transform', function(d) {
                    var distance = Math.sqrt(Math.pow(d.arc.centroid()[0], 2) + Math.pow(d.arc.centroid()[1], 2));
                    var n = spaceHover / distance;

                    return 'translate(' + n * d.arc.centroid()[0] + ',' + n * d.arc.centroid()[1] + ')';
                });

            g.select('text.percent')
                .transition().duration(500)
                .ease(sc.easing)
                .attr('opacity', 1)
                .tween('text', function() {
                    var i = d3.interpolate(0, Math.round((d.arc.endAngle()() - d.arc.startAngle()()) / 2 / Math.PI * 100));
                    return function(t) {
                        this.textContent = (i(t)).toFixed(1) + "%";
                    };
                });
        }

    });

    pie.on('click', function(d) {

        if (!d.active) {
            d3.select(this)
                .transition().duration(200).ease('bounce')
                .attr('d', function() {
                    return drawArc(d.arc.startAngle()(), d.arc.endAngle()(), rHover)();
                })
                .attr('transform', function(d) {
                    var distance = Math.sqrt(Math.pow(d.arc.centroid()[0], 2) + Math.pow(d.arc.centroid()[1], 2));
                    var n = spaceActive / distance;

                    return 'translate(' + n * d.arc.centroid()[0] + ',' + n * d.arc.centroid()[1] + ')';
                });
        }
      //  g.select('rect').style('display', 'none');
      //  g.select('text').text('');
        d.active = !d.active;
    });

    pie.on('mousemove', function(d) {

        var nameText = g.select('text')
            .attr('x', function() {
                return d3.mouse(this)[0] + 10;
            })
            .attr('y', function() {
                return d3.mouse(this)[1] + 30;
            })
            .style('fill', d3.rgb(255, 255, 255))
            .text(function() {
                return d.name;
            })
            .attr('height', function() {
                return this.getBBox().height;
            })
            .attr('width', function() {
                return this.getBBox().width;
            });

        g.select('rect')
            .style('display', 'block')
            .attr('width', function() {
                return parseFloat(nameText.attr('width'), 10) + 10;
            })
            .attr('height', nameText.attr('height'))
            .attr('x', function() {
                return d3.mouse(this)[0] + 5 - nameText.attr('width') / 2;
            })
            .attr('y', function() {
                return d3.mouse(this)[1] + 13;
            });

    });

    pie.on('mouseout', function(d) {
        if (!d.active) {
            d3.select(this)
                .transition().duration(200).ease(sc.easing)
                .attr('d', function() {
                    return drawArc(d.arc.startAngle()(), d.arc.endAngle()())();
                })
                .attr('transform', 'translate(0, 0)');

            g.select('text.percent').transition()
                .duration(500).ease(sc.easing)
                .attr('opacity', 0);
        }

        g.select('rect').style('display', 'none');
        g.select('text').text('');
    });

    // start transition animation clip path
    var clipPath = g.append('defs').append('clipPath')
        .attr('id', 'clipMask')
        .append('path')
        .attr('d', function() {
            return drawArc(0, 10 / r, rHover)();
        });

    // hover text background
    var textWrapper = g.append('rect')
        .style('fill', d3.rgb(0, 0, 0))
        .style('opacity', 0.7)
        .style('display', 'none');
    // hover text
    var nameText = g.append('text')
        .attr('class', 'name')
        .style('fill', d3.rgb(255, 255, 255))
        .attr('font-family', 'Montserrat')
        .attr('text-anchor', 'middle');

    var percentText = g.append('text')
        .attr('x', 0)
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', 50)
        .attr('font-family', 'Montserrat')
        .attr('class', 'percent')
        .style('fill', d3.rgb(0, 0, 0));

    sc.transitionBack = function(callback, options) {
        clipPath.transition().duration(sc.duration).ease(sc.easing)
            .attrTween('d', function() {
                var i = d3.interpolate(2 * Math.PI, 10 / r);

                return function(t) {
                    return drawArc(0, i(t), rHover)();
                };
            })
            .each('end', callback);

        return sc;
    };

    sc.transitionForward = function(callback) {
        clipPath.transition().duration(sc.duration).ease(sc.easing)
            .attrTween('d', function() {
                var i = d3.interpolate(10 / r, 2 * Math.PI);

                return function(t) {
                    return drawArc(0, i(t), rHover)();
                };
            })
            .each('end', callback);

        return sc;
    };

    if (showOnStart)
        sc.transitionForward();

    return sc;
};



// create bar chart
SproutChart.prototype.barChart = function(options) {
    var sc = this;

    sc.type = 'bar';

    options = options || {};

    var barHeight = options.barHeight || 30,
        gap = options.gap || 0,
        padding = options.padding || 50,
        showOnStart = options.showOnStart !== undefined ? options.showOnStart : true , // call transitionForward() on start
        max;

    sc.data = sc.data.map(function(d, i) {
        max = max ? (d.value > max ? d.value : max) : d.value;

        return {
            name: d.name,
            value: d.value,
            color: d.color || sc.materialColor[i]
        };
    });

    var ratio = options.ratio || (sc.size - padding * 2) / max;

    // create the svg container
    var g = sc.svg.append('g')
        .attr('class', 'bar');

    g.attr('transform', function() {
        var y = (sc.size - sc.data.length * (barHeight + gap) - gap) / 2;
        return 'translate(' + (options.offx+padding) + ', ' + (options.offy+y) + ')';
    });

    var bar = g.selectAll('rect')
        .data(sc.data)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', function(d, i) {
            return i * (barHeight + gap);
        })
        .attr('height', barHeight)
        .attr('width', 10)
        .style('fill', function(d) {
            return d.color;
        })
        .style('clip-path', 'url(#clipMask)');

    var barValue = g.selectAll('text')
        .data(sc.data)
        .enter().append('text')
        .attr('class', 'bar-value')
        .attr('x', 0)
        .attr('y', function(d, i) {
            return i * (barHeight + gap) + barHeight * 0.7;
        })
        .attr('opacity', 0)
        .attr('font-size', barHeight * 0.7)
        .attr('font-family', 'Montserrat')
        .attr('text-anchor', 'start');

    bar.on('mousemove', function(d) {
        d3.select(this).style('fill','yellow');
        var nameText = g.select('text.name')
            .attr('x', function() {
                return d3.mouse(this)[0] + 10;
            })
            .attr('y', function() {
                return d3.mouse(this)[1] + 30;
            })
            .style('fill', d3.rgb(255, 255, 255))
            .text(function() {
                return d.name;
            })
            .attr('height', function() {
                return this.getBBox().height;
            })
            .attr('width', function() {
                return this.getBBox().width;
            });

        g.select('rect.nameBackground')
            .style('display', 'block')
            .attr('width', function() {
                return parseFloat(nameText.attr('width'), 10) + 10;
            })
            .attr('height', nameText.attr('height'))
            .attr('x', function() {
                return d3.mouse(this)[0] + 5 - nameText.attr('width') / 2;
            })
            .attr('y', function() {
                return d3.mouse(this)[1] + 13;
            });
    });

    bar.on('mouseout', function(d) {
        d3.select(this).style('fill',d.color);
        g.select('rect.nameBackground').style('display', 'none');
        g.select('text.name').text('');
    });

    sc.transitionForward = function(callback) {
        bar.transition()
            .duration(sc.duration / 2).ease(sc.easing)
            .delay(function(d, i) {
                return i * (sc.duration / 2 / sc.data.length);
            })
            .attr('width', function(d) {
                return d.value * ratio;
            })
            .each('end', function(d, i) {
                if (i === sc.data.length - 1 && typeof(callback) === 'function')
                    callback();
            });

        barValue.transition()
            .duration(sc.duration / 2).ease(sc.easing)
            .delay(function(d, i) {
                return i * (sc.duration / 2 / sc.data.length);
            })
            .attr('x', function(d) {
                return d.value * ratio + barHeight * 0.3;
            })
            .attr('opacity', 1)
            .tween('text', function(d) {
                var i = d3.interpolate(0, d.value);

                return function(t) {
                    this.textContent = Math.round(i(t));
                };
            });

        clipPath.transition().duration(sc.duration * (sc.data.length - 1) / sc.data.length).ease(sc.easing)
            .attr('height', sc.size);

        return sc;
    };

    sc.transitionBack = function(callback) {
        bar.transition()
            .duration(sc.duration / 2).ease(sc.easing)
            .delay(function(d, i) {
                return (sc.data.length - i - 1) * (sc.duration / 2 / sc.data.length);
            })
            .attr('width', 10)
            .each('end', function(d, i) {
                if (i === 0 && typeof(callback) === 'function')
                    callback();
            });

        barValue.transition()
            .duration(sc.duration / 2).ease(sc.easing)
            .delay(function(d, i) {
                return (sc.data.length - i - 1) * (sc.duration / 2 / sc.data.length);
            })
            .attr('x', barHeight * 0.3)
            .attr('opacity', 0)
            .tween('text', function(d) {
                var i = d3.interpolate(d.value, 0);

                return function(t) {
                    this.textContent = Math.round(i(t));
                };
            });

        clipPath.transition().duration(sc.duration * (sc.data.length - 1) / sc.data.length).ease(sc.easing)
            .attr('height', barHeight);

        return sc;
    };

    var clipPath = g.append('defs').append('clipPath')
        .attr('id', 'clipMask')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', barHeight)
        .attr('width', 0.7*sc.size);

    // hover text background
    var textWrapper = g.append('rect')
        .attr('class', 'nameBackground')
        .style('fill', d3.rgb(0, 0, 0))
        .style('opacity', 0.7)
        .style('display', 'none');
    // hover text
    var nameText = g.append('text')
        .attr('class', 'name')
        .style('fill', d3.rgb(255, 255, 255))
        .attr('font-family', 'Montserrat')
        .attr('text-anchor', 'middle');

    if (showOnStart)
        sc.transitionForward();

    return sc;
};

SproutChart.prototype.transformTo = function(type, options, callback) {
    var sc = this;

    callback = typeof(options) === 'function' ? options : callback;
    options = typeof(options) === 'object' ? options : {};

    if (sc.type === type || !sc.type) {
        return sc;
    }

    sc.transitionBack();

    sc.svg.select('g').transition()
        .duration(sc.duration).ease(sc.easing)
        .attr('transform', function(d) {
            var barHeight = options.barHeight || 30,
                gap = options.gap || 0,
                padding = options.padding || 50,
                r = options.r || 150;

            var y = (sc.size - sc.data.length * (barHeight + gap) - gap) / 2;

            if (type === 'bar')
                return 'translate(' + (options.offx+padding) + ', ' + (options.offy+r + y) + ')';
            else if (type === 'pie')
                return 'translate(' + (options.offx+sc.size / 2) + ', ' + (options.offy+sc.size / 2 - r) + ')';
        })
        .each('end', function() {
            if (type === 'bar') {
                sc.barChart(options);
                sc.svg.select('g:not(.bar)').remove();
            }
            else if (type === 'pie') {
                sc.pieChart(options);
                sc.svg.select('g:not(.pie)').remove();
            }

        });

    if (typeof(callback) === 'function') {
        callback();
    }

    return sc;
};


chart = new SproutChart(document.getElementById('part2'), data_sex);
var tmpHeight;
if (data_sex.length>8)
    tmpHeight=200/data.length;
else tmpHeight=30

var options = {
    offx:60,
    offy:-50,
    barHeight: tmpHeight,
    r: 120,
    innerRadius: 90,
    rHover: 120
};
chart.pieChart(options);

$("label[for=sex]").css("background-color","yellow");
$("#changeBtn").click(function(){
        if (this.checked) {
            chart.transformTo('pie', options);
        } else {
            chart.transformTo('bar', options);
        }
    });
// inject to target DOM
$("input[name='barOption']").change(function(){
    var barOption=this.id;
    var chart;
    var data;
    $(".choice2-label").css("background-color","white");
    if (barOption=='sex'){
        chart = new SproutChart(document.getElementById('part2'), data_sex);
        data=data_sex;
        $("label[for=sex]").css("background-color","yellow");
    }
    else if (barOption=='degree'){
        chart = new SproutChart(document.getElementById('part2'), data_degree);
        data=data_degree;
        $("label[for=degree]").css("background-color","yellow");
    }
    else if (barOption=='race'){
        chart = new SproutChart(document.getElementById('part2'), data_race);
        data=data_race;
        $("label[for=race]").css("background-color","yellow");
    }
    else{
        chart = new SproutChart(document.getElementById('part2'), data_age);
        data=data_age;
        $("label[for=age]").css("background-color","yellow");
    }
    console.log(chart);
    var tmpHeight;
    if (data.length>8)
        tmpHeight=200/data.length;
    else tmpHeight=30

    var options = {
        offx:60,
        offy:-50,
        barHeight: tmpHeight,
        r: 120,
        innerRadius: 90,
        rHover: 120
    };
    chart.pieChart(options);

    $("#changeBtn").click(function(){
        if (this.checked) {
            chart.transformTo('pie', options);
        } else {
            chart.transformTo('bar', options);
        }
    });

});
