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
      if (this.readyState === 4 && this.status === 200) {
        processResponseCallback(this.response);
        var label = document.getElementById('weatherLocation');
        label.innerText = address.value;
      } else {
        console.log('not finished', request.response);
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
  console.log(forecast);
  drawHistogram(forecast.properties.periods);
}


window.onload = function (e) {
  var button = document.getElementById("getWeatherButton");
  button.onclick = doWeatherRequest;
  // TODO add if else logic for the button to work
};

function drawHistogram(data) {
  console.log(data);
  function stackMax(serie) {
    return d3.max(serie, function (d) { return d[1]; });
  }

  function stackMin(serie) {
    return d3.min(serie, function (d) { return d[0]; });
  }

  var series = data;
  console.log(series);
  var svg = d3.select("svg"), margin = { top: 30, right: 20, bottom: 30, left: 60 },
    width = +svg.attr("width"),
    height = +svg.attr("height");

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
    .data(series)
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
        if (d.shortForecast.includes("Rain")) {
          return "url(#rain)";
        } else {
          return "url(#clear)";
        }
      } else {
        return "url(#night)";
      }
    })
    .on("mouseover", handleMouseIn)
    .on("mouseout", handleMouseOut);

  rows.selectAll("text")
    .data(function (d) {
      return [d];
    })
    .enter().append("text")
    .text(function (d) {
      console.log("text");
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
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", "translate(" + margin.left + ","+margin.top+")")
    .call(d3.axisLeft(y));

  function handleMouseIn(d, i) {
    //rows.selectAll("rect")
    //  .attr("width", barWidth);
    //var sel = d3.select(this);
    //var x = sel.attr("x");
    //var y = sel.attr("y");
    //d3.select(this.parentNode).moveToFront();
    //sel.transition().duration(100).attr("width", 500);
    //d3.select(this.parentNode)
    //  .data(function (d) {
    //  return [d];
    //}).enter().append("text")
    //  .text(function (d) {
    //    return d.shortForecast;
    //  })
    //  .attr("x", x)
    //  .attr("y", y);
  }

  function handleMouseOut(d, i) {
    //d3.select(this).attr("width", barWidth);
  }

  
}