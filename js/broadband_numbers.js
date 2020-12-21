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
      var pagination_items = $('.bb-numbers-pagination li');
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

  $('.bb-numbers-pagination a').on('click', function() {
    var linkDest = $(this).attr('href');
    $.scrollify.move(linkDest);
  });


  // cost chart
  function costReduceChart() {
    var data, margin, width, height, viewBox, parseDate, x, y,
        maxCost, xAxis, svg, bar;

    // broadband adoption data
    data = [{"year":"2000", "cost": 28.13},
            {"year":"2020", "cost": 0.64}];

    // dimensions
    margin = {top: 0, right: 0, bottom: 50, left: 0};
    width = 400 - margin.left - margin.right;
    height = 400 - margin.top - margin.bottom;
    viewBox = "0 0 400 400";

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
        .text(function(d) { return '$' + d.cost.toFixed(2); })
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
    removeCostChart();
    removeGlobalSpeedChart();
    removeGlobalCostChart();
    removeDonutChart();
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
