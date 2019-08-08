d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};


function doWeatherRequest() {
  
  var address = document.getElementById("addressTextbox");
  console.log(address);
  if (address.value) {
    console.log("Requesting weather");
    let url = encodeURI("api/Weather/" + address.value);

    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          processResponseCallback(this.response);
          var label = document.getElementById('weatherLocation');
          label.innerText = address.value;
        } else {
          alert("Error getting weather for" + address.value);
        }
      } else {
      }
    };

    request.open('GET', url, true);
    request.send();
  } else {
    alert("Please enter an address");
  }
}

function processResponseCallback(response) {
  let forecast = JSON.parse(response);
  if (forecast.properties === undefined) {
    alert("Failed to get weather for location");
  } else {
    drawHistogram(forecast.properties.periods.slice(0, 10));
  }
}


window.onload = function (e) {
  var button = document.getElementById("getWeatherButton");
  button.onclick = doWeatherRequest;
};

function drawHistogram(data) {
  
  var svg = d3.select("svg"), margin = { top: 30, right: 20, bottom: 30, left: 60 },
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll("*").remove();

  // add images

  var defs = svg.append("defs");
  defs.append("pattern")
    .attr("id", "clear")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "Images/sunny_image.jpg")
    .attr("width", 1024)
    .attr("height", 683);

  defs.append("pattern")
    .attr("id", "night")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "Images/night.jpeg")
    .attr("width", 1234)
    .attr("height", 750);

  defs.append("pattern")
    .attr("id", "rain")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "Images/raining.jpg")
    .attr("width", 1024)
    .attr("height", 760);

  defs.append("pattern")
    .attr("id", "cloudy")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "Images/cloudy.jpg")
    .attr("width", 1485)
    .attr("height", 810);

  defs.append("pattern")
    .attr("id", "nightcloudy")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", width)
    .attr("height", height)
    .append("image")
    .attr("xlink:href", "Images/night_cloudy.jpg")
    .attr("width", 1296)
    .attr("height", 864);
  

  var x = d3.scaleBand()
    .domain(data.map(function (d) { return d.name; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .rangeRound([height - margin.top - margin.bottom, 0])
    .domain([d3.min(data, function (d) { return d.temperature; }),
    d3.max(data, function (d) { return d.temperature; })]);
    
  var minTemp = d3.min(data, function (d) { return d.temperature; });

  var barWidth = Math.floor(width / data.length) - 1;

  // TODO investigate how to change scheme based on temperature
  var z = d3.scaleOrdinal(d3.schemeCategory10);

  var rows = svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("fill", function (d) {
      return z(d.key);
    });
  rows
    .selectAll("rect")
    .data(function (d) {
      return [d];
    })
    .enter().append("rect")
    .attr("width", barWidth)
    .attr("x", function (d) {
      return x(d.name);
    })
    .attr("y", function (d) {

      return y(d.temperature) - margin.bottom;
    })
    .attr("height", function (d) {
      return height - y(d.temperature);
    })
    .attr("fill", function (d) {
      if (d.isDaytime) {
        if (d.shortForecast.includes("Rain") || d.shortForecast.includes("rain")) {
          return "url(#rain)";
        } else if (d.shortForecast.includes("Cloudy") || d.shortForecast.includes("Overcast")) {
          return "url(#cloudy)";
        }
        else {
          return "url(#clear)";
        }
      } else {
        if (d.shortForecast.includes("Cloudy")) {
          return "url(#nightcloudy)";
        } else {
          return "url(#night)";
        }
      }
    });
    //.on("mouseover", handleMouseIn)
    //.on("mouseout", handleMouseOut);

  rows.selectAll("text")
    .data(function (d) {
      return [d];
    })
    .enter().append("text")
    .text(function (d) {
      console.log(d);
      return d.temperature + " " + d.temperatureUnit;
    })
    .attr("y", function (d) {
      return Math.max(y(d.temperature), 25);
    })
    .attr("x", function (d) {
      return x(d.name) + barWidth * .05;
    })
    .attr("fill", function (d) {
      return d3.interpolateRdBu(1 - (d.temperature - 42) / 58);
    })
    .attr("class", "temperatureText");
    
  svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(x))
    .selectAll("g")
    .selectAll("text")
    .attr("width", barWidth);

  svg.append("g")
    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
    .call(d3.axisLeft(y));

  function handleMouseIn(d, i) {
    rows.selectAll("rect")
      .attr("width", barWidth);
    var sel = d3.select(this);
    var x = sel.attr("x");
    var y = sel.attr("y");
    d3.select(this.parentNode).moveToFront();
    sel.transition().duration(100).attr("width", 500);
    // add forecast to parent node
    console.log(d3.select(sel.node().parentNode).select("g"));
    d3.select(this.parentNode)
      .selectAll(".description")
      .attr("style", "display: block;");
  }

  function handleMouseOut(d, i) {
    d3.select(this).attr("width", barWidth);
    d3.select(this.parentNode)
      .selectAll(".decription").remove();
    d3.select(this.parentNode)
      .selectAll(".description")
      .attr("style", "display: hidden;");
  }

  
}