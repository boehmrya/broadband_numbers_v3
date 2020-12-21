jQuery(function($){

  $.scrollify({
    section : ".story-wrap .story",
    sectionName : "section-name",
    interstitialSection : ".footer",
    easing: "easeOutExpo",
    scrollSpeed: 1100,
    offset : 0,
    scrollbars: true,
    standardScrollElements: "",
    setHeights: true,
    overflowScroll: true,
    updateHash: true,
    touchScroll:true,
    before:function(index, elements) {
      // disable all charts
      removeCharts();

      // build chart based on story
      if (index == 4) {
        globalSpeedChart()
        globalCostChart();
      }
      else if (index == 5) {
        createDonutChart('.future .donut-chart', 80);
      }
      else if (index == 7) {
        costReduceChart();
      }

      var this_elem = elements[index];
      // switch active classes on sections
      $('.story').removeClass('active');
      this_elem.addClass('active');

      // switch active classes on pagination items
      var pagination_items = $('.pagination li');
      pagination_items.children('a').removeClass('active');
      pagination_items.eq(index).children('a').addClass('active');
    },
    after:function(index, elements) {

    },
    afterResize:function() {},
    afterRender:function() {}
  });

  $('.top .down-arrow').on('click', function() {
    $.scrollify.move("#adoption");
  });

  $('.pagination a').on('click', function() {
    var linkDest = $(this).attr('href');
    $.scrollify.move(linkDest);
  });


  function speedChart() {
    var data, margin, width, height, viewBox, parseDate, x, y,
        tickLabels, xAxis, yAxis, initialArea, area, svg, chartwidth;

    // broadband adoption data
    data = [{"date":"2010", "speed": 50},
            {"date":"2015", "speed": 1000},
            {"date":"2020", "speed": 2000}];

    // Set the margins
    margin = {top: 100, right: 40, bottom: 40, left: 20},
    width = 1140 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    viewBox = "0 0 1140 500";

    parseDate = d3.time.format("%Y").parse;

    // Take each row and put the date column through the parsedate form we've defined above.
    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    // Setting up the scaling objects
    var x = d3.time.scale()
      .range([0, width]);

    // Same for the y axis
    var y = d3.scale.linear()
      .range([height, 0]);

    // Set the domain of the x-value
    x.domain(d3.extent(data, function(d) { return d.date; }));

    // Do the same for the y-axis...[0,800000] by looking at the minimum and maximum for the speed variable.
    y.domain(d3.extent(data, function(d) { return d.speed; }));

    //Setting x-axis up here using x scaling object
    var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(data.length)
      .tickSize(12,12)
      .orient("bottom");

    // Setting up a d3 line object - used to draw lines later
    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.speed); })
      //.interpolate("cardinal");

    // Now to actually make the chart area
    var svg = d3.select(".speed-chart").append("svg")
      .attr("class", "svgele")
      .attr("id", "svgEle")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", viewBox);

    var chartGroup = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(data); })
      .attr("stroke-linecap","round")
      .style("stroke", "#5ac8e7");

    // Bind the x-axis to the svg object
    chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.selectAll(".dot")
      .data(data)  // This is the nested data call
      .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.date) + margin.left; })
        .attr("cy", function(d) { return y(d.speed) + margin.top; })
        .attr("r", 8)
        .attr("fill", "#5ac8e7");

    svg.selectAll(".speed-number")
      .data(data)  // This is the nested data call
      .enter()
        .append("text")
          .attr("class", "speed-number")
          .attr("x", function(d, i) {
            var diff = 10;
            return x(d.date) + diff;
          })
          .attr("y", function(d, i) {
            var diff = 20;
            if (i == 2) {
              diff += 20;
            }
            return y(d.speed) + diff;
          })
          .attr("fill", "#fff")
          .text(function(d) {
            if (d.speed >= 1000) {
              return d.speed / 1000;
            }
            else {
              return d.speed;
            }
          });

    svg.selectAll(".speed-label")
      .data(data)  // This is the nested data call
      .enter()
        .append("text")
          .attr("class", "speed-label")
          .attr("x", function(d, i) {
            var diff = 0;
            if (i != 0) {
              diff -= 5;
            }
            return x(d.date) + diff;
          })
          .attr("y", function(d, i) {
            var diff = 50;
            if (i == 2) {
              diff += 20;
            }
            return y(d.speed) + diff;
          })
          .attr("fill", "#fff")
          .text(function(d, i) {
            if (d.speed >= 1000) {
              return "GBPS";
            }
            else {
              return "MBPS";
            }
          });

     //Initially set the lines to not show
     d3.selectAll(".line").style("opacity",0);

      //Select All of the lines and process them one by one
  	  d3.selectAll(".line").each(function(d,i) {
        d3.select(this).style("opacity","1");

  		  // Get the length of each line in turn
  		  var totalLength = d3.select(".line").node().getTotalLength();

  			d3.selectAll(".line")
          .attr("stroke-dasharray", totalLength + " " + totalLength)
    			  .attr("stroke-dashoffset", totalLength)
    			  .transition()
    			  .duration(2000)
    			  .ease("ease-in") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
    			  .attr("stroke-dashoffset", 0)
    			  .style("stroke-width", 3);
  		});

      // reveal text
      d3.selectAll("svg.svgele .speed-number, svg.svgele .speed-label")
        .transition()
        .delay(1000)
        .duration(3000)
        .style("opacity", 1);

  }


  // cost chart
  function costReduceChart() {
    var data, margin, width, height, viewBox, parseDate, x, y,
        maxCost, xAxis, svg, bar;

    // broadband adoption data
    data = [{"year":"2000", "cost": 28.13},
            {"year":"2020", "cost": 0.64}];

    // dimensions
    margin = {top: 0, right: 0, bottom: 50, left: 0};
    width = 500 - margin.left - margin.right;
    height = 400 - margin.top - margin.bottom;
    viewBox = "0 0 500 400";

    parseDate = d3.time.format("%Y").parse;

    // Take each row and put the date column through the parsedate form we've defined above.
    data.forEach(function(d) {
      d.year = parseDate(d.year);
    });

    x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .05, 0);

    y = d3.scale.linear()
        .range([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.time.format("%Y"))
        .tickSize(0)
        .orient("bottom");

    svg = d3.select(".cost-chart").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", viewBox)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    maxCost = d3.max(data, function(d) { return d.cost; });

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, maxCost]);

    // add axes and labels
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Bars
  bar = svg.selectAll(".cost-chart-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "cost-chart-bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("y", height / 2)
        .attr("width", x.rangeBand())
        .attr("height", height / 2);

  bar.transition()
      .duration(2000)
      .ease("ease-in-out")
      .attr("y", function(d) { return y(d.cost); })
      .attr("height", function(d) { return height - y(d.cost); })
      .each("end", function() {
        d3.selectAll(".cost-chart-bar-label").attr("class", function(d) {
          return 'cost-chart-bar-label white reveal';
          /*
          var year = d.year.getFullYear();
          if (year == 2000) {
            return 'cost-chart-bar-label white reveal';
          }
          return 'cost-chart-bar-label red reveal';
          */
        })
      });

  svg.selectAll(".cost-chart-bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", function(d) {
        var year = d.year.getFullYear();
        if (year == 2000) {
          return 'cost-chart-bar-label white';
        }
        return 'cost-chart-bar-label red';
    })
    .attr("x", function(d) { return x(d.year) + (x.rangeBand() / 2) })
    .attr("y", function(d){ return height - 100; })
    .text(function(d) { return '$' + d.cost; })
    .attr("text-anchor", "middle");

    $('.shape-wrap .box').addClass('full');

    $('.cost-percent-num .num').each(function () {
      var $this = $(this);
      $({ Counter: 0 }).animate({ Counter: $this.text() }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $this.text(Math.ceil(this.Counter));
        }
      });
    });
  }

  // global speed chart
  function globalSpeedChart() {
    var data, margin, width, height, viewBox, parseDate, x, y,
        maxCost, xAxis, svg, bar;

    // broadband adoption data
    data = [{"place":"U.S.", "speed": 161},
            {"place":"Global", "speed": 85.7}];

    // dimensions
    margin = {top: 60, right: 0, bottom: 0, left: 0};
    width = 600 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;
    viewBox = "0 0 600 300";

    x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .025, 0);

    y = d3.scale.linear()
        .range([height, 0]);

        /*
    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .orient("bottom");
        */

    svg = d3.select(".global-speed-chart").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", viewBox)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    maxSpeed = d3.max(data, function(d) { return d.speed; });

    x.domain(data.map(function(d) { return d.place; }));
    y.domain([0, maxSpeed]);

    // add axes and labels
    /*
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        */

    // Bars
  bar = svg.selectAll(".global-speed-chart-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) {
          if (d.place == "U.S.") {
            return "global-speed-chart-bar red"
          }
          else {
            return "global-speed-chart-bar blue"
          }
        })
        .attr("x", function(d) { return x(d.place); })
        .attr("y", height)
        .attr("width", x.rangeBand())
        .attr("height", 0);

  bar.transition()
      .duration(1500)
      .ease("ease-in-out")
      .attr("y", function(d) { return y(d.speed); })
      .attr("height", function(d) { return height - y(d.speed); })
      .each("end", function() {
        d3.selectAll(".global-speed-chart .chart-bar-label").attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-label red reveal';
          }
          else {
            return 'chart-bar-label blue reveal';
          }
        });

        d3.selectAll(".global-speed-chart .chart-bar-data").attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-data white reveal';
          }
          else {
            return 'chart-bar-data blue reveal';
          }
        });
      });

    svg.selectAll(".global-speed-chart .chart-bar-data")
      .data(data)
      .enter()
      .append("text")
      .attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-data white';
          }
          return 'chart-bar-data blue';
      })
      .attr("x", function(d) { return x(d.place) + (x.rangeBand() / 2) })
      .attr("y", function(d){ return height - 30; })
      .text(function(d) { return d.speed + " Mbps"; })
      .attr("text-anchor", "middle");

    svg.selectAll(".global-speed-chart chart-bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-label red';
          }
          return 'chart-bar-label blue';
      })
      .attr("x", function(d) { return x(d.place) + (x.rangeBand() / 2) })
      .attr("y", function(d){ return y(d.speed) - 30; })
      .text(function(d) { return d.place; })
      .attr("text-anchor", "middle");

  }


  // global cost chart
  function globalCostChart() {
    var data, margin, width, height, viewBox, parseDate, x, y,
        maxCost, xAxis, svg, bar;

    // broadband adoption data
    data = [{"place":"U.S.", "cost": 0.30},
            {"place":"Europe", "cost": 0.34}];

    // dimensions
    margin = {top: 60, right: 0, bottom: 0, left: 0};
    width = 600 - margin.left - margin.right;
    height = 200 - margin.top - margin.bottom;
    viewBox = "0 0 600 200";

    x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .025, 0);

    y = d3.scale.linear()
        .range([height, 0]);

        /*
    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .orient("bottom");
        */

    svg = d3.select(".global-cost-chart").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", viewBox)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    maxCost = d3.max(data, function(d) { return d.cost; });

    x.domain(data.map(function(d) { return d.place; }));
    y.domain([0, maxCost]);

    // add axes and labels
    /*
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        */

    // Bars
  bar = svg.selectAll(".global-cost-chart-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) {
          if (d.place == "U.S.") {
            return "global-cost-chart-bar red"
          }
          else {
            return "global-cost-chart-bar blue"
          }
        })
        .attr("x", function(d) { return x(d.place); })
        .attr("y", height)
        .attr("width", x.rangeBand())
        .attr("height", 0);

  bar.transition()
      .duration(1500)
      .ease("ease-in-out")
      .attr("y", function(d) { return y(d.cost); })
      .attr("height", function(d) { return height - y(d.cost); })
      .each("end", function() {
        d3.selectAll(".global-cost-chart .chart-bar-label").attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-label red reveal';
          }
          else {
            return 'chart-bar-label blue reveal';
          }
        });

        d3.selectAll(".global-cost-chart .chart-bar-data").attr("class", function(d) {
          if (d.place == "U.S.") {
            return 'chart-bar-data white reveal';
          }
          else {
            return 'chart-bar-data blue reveal';
          }
        });
      });

      svg.selectAll(".global-cost-chart .chart-bar-data")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d) {
            if (d.place == "U.S.") {
              return 'chart-bar-data white';
            }
            return 'chart-bar-data blue';
        })
        .attr("x", function(d) { return x(d.place) + (x.rangeBand() / 2) })
        .attr("y", function(d){ return height - 30; })
        .text(function(d) { return '$' + d.cost; })
        .attr("text-anchor", "middle");

    svg.selectAll(".global-cost-chart .chart-bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", function(d) {
        if (d.place == "U.S.") {
          return 'chart-bar-label red';
        }
        return 'chart-bar-label blue';
      })
      .attr("x", function(d) { return x(d.place) + (x.rangeBand() / 2) })
      .attr("y", function(d){ return y(d.cost) - 30; })
      .text(function(d) { return d.place; })
      .attr("text-anchor", "middle");
  }


  // function to generate each donut chart
  function createDonutChart(selector, percent) {
    var duration = 2000;
    var transition = 200;
    var width = $(selector).width();
    var height = width;
    var viewBox = "0 0 " + width + " " + height;

    var dataset = {
                lower: calcPercent(0),
                upper: calcPercent(percent)
            },
            radius = Math.min(width, height) / 2.25,
            pie = d3.layout.pie().sort(null),
            format = d3.format(".0%");

    var arc = d3.svg.arc()
            .innerRadius(radius * .5)
            .outerRadius(radius);

    var svg = d3.select(selector).append("svg")
            .attr("viewBox", viewBox)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var path = svg.selectAll("path")
                    .data(pie(dataset.lower))
                    .enter().append("path")
                    .attr("class", function (d, i) {
                        return "color" + i
                    })
                    .attr("d", arc)
                    .each(function (d) {
                        this._current = d;
                    });

    var progress = 0;

    var timeout = setTimeout(function () {
        clearTimeout(timeout);
        path = path.data(pie(dataset.upper));
        path.transition().duration(duration).attrTween("d", function (a) {
            var i = d3.interpolate(this._current, a);
            var i2 = d3.interpolate(progress, percent)
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        });
    }, 200);

    function calcPercent(percent) {
        return [percent, 100 - percent];
    };
  }


  // wrapper function to remove charts on section transitions
  function removeCharts() {
    removeSpeedChart();
    removeCostChart();
    removeGlobalSpeedChart();
    removeGlobalCostChart();
    removeDonutChart();
  }

  // functions to remove charts
  function removeSpeedChart() {
    $('.speed-chart svg').remove();
  }

  function removeCostChart() {
    $('.cost-chart svg').remove();
  }

  function removeGlobalSpeedChart() {
    $('.global-speed-chart svg').remove();
  }

  function removeGlobalCostChart() {
    $('.global-cost-chart svg').remove();
  }

  function removeDonutChart() {
    $('.future .donut-chart svg').remove();
  }


});
