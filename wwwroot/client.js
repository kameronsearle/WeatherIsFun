function doWeatherRequest(url) {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      processResponseCallback(xhr.response);
    }
  };

  request.open('GET', url, true);
}

function processResponseCallback(response) {
  // TODO process JSON
}


window.onload = function (e) {
  // TODO bind submit button

  // TODO add if else logic for the button to work
};

function drawHistogram() {

}