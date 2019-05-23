# D3 TimelineChart

[![Build Status](https://travis-ci.org/commodityvectors/d3-timeline.svg?branch=master)](https://travis-ci.org/commodityvectors/d3-timeline)

[![NPM](https://nodei.co/npm/d3-timeline-chart.png)](https://nodei.co/npm/d3-timeline-chart/)

![Chart example](https://raw.githubusercontent.com/commodityvectors/d3-timeline/master/usage.gif)

## Installing

`npm install d3-timeline-chart --save`

## Example

```javascript
'use strict';
const element = document.getElementById('chart');
const data = [{
    label: 'Name',
    data: [{
        type: TimelineChart.TYPE.POINT,
        at: new Date([2015, 1, 11])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2015, 1, 15])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2015, 3, 10])
    }, {
        label: 'I\'m a label',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2015, 2, 1]),
        to: new Date([2015, 3, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2015, 6, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2015, 7, 1]),
        customClass: 'custom-class'
    }]
}];

const timeline = new TimelineChart(element, data, {
    tip: function(d) {
        return d.at || `${d.from}<br>${d.to}`;
    }
});
```

## Config

Available config parameters

### intervalMinWidth (8)
This allows you to define a minimum width for an interval element. Sometimes, when you zoom out too much you might still want to be able to visualize the interval. It defaults to 8.

### tip (undefined)
A function that receives as parameter a data point and returns an HTML text to be displayed as a tooltip

## License

The MIT License (MIT)

Copyright (c) [2016] [Commodity Vectors]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
