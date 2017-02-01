var origin;
var destination;
var arrivalTime;
function getDirections() {
  origin = document.getElementById("origin").value;
  destination = document.getElementById("destination").value;
  arrivalTime = document.getElementById("arrivalTime").value;

  var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.status == 200) {
            load(this);
        }
    };
    xhttp.onerror = function(err) {
        alert("Error: " + err);
    }
    xhttp.onloadstart = function() {
      document.getElementById("dir-container").style.display = "block";
      document.getElementById("loader").style.display = "block";
    }
    xhttp.onloadend = function() {
      document.getElementById("loader").style.display = "none";
    }
    var arriveBy = new Date();
    arriveBy.setHours(arrivalTime.split(":")[0],arrivalTime.split(":")[1]);
    var url = "https://maps.googleapis.com/maps/api/directions/xml?mode=transit&origin=" + origin +
        "&destination=" + destination + "&arrival_time="+ Math.round(arriveBy.getTime()/1000) + "&key=AIzaSyAQLrqyOK42M1juBuy9SY4DUVPdqnlVeEA";
    xhttp.open("GET", url, true);
    xhttp.send();
}

function load(response) {
  var xml = response.responseXML;
    if (xml == null) {
        alert('Invalid response from server.');
        return;
    }
    var directions = xml.getElementsByTagName("step");
    if (directions.length == 0) {
        alert("No Direction Data.");
    }
    /*for (var i = 0; i < directions.length; i++) {
        console.log(directions[i]);
    }*/
    var output = "";

    for (var i = 0; i < directions.length; i++) {
      var direction = directions[i];
      var travelMode = direction.getElementsByTagName("travel_mode")[0];
      if (travelMode) travelMode = travelMode.childNodes[0];
      if (travelMode) travelMode = travelMode.nodeValue;
      if (travelMode == "WALKING") {
        output += '<i class="material-icons">directions_walk</i>';
      }
      else {
        output += '<i class="material-icons">directions_transit</i>';
      }
      var instruction = direction.getElementsByTagName("html_instructions")[0];
      if (instruction) instruction = instruction.childNodes[0];
      if (instruction) instruction = instruction.nodeValue;
      output += instruction;
      output += " (";
      var duration = direction.getElementsByTagName("duration")[0];
      if (duration) duration = duration.getElementsByTagName("text")[0];
      if (duration) duration = duration.childNodes[0];
      if (duration) duration = duration.nodeValue;
      output += duration;
      output += ", ";
      var distance = direction.getElementsByTagName("distance")[0];
      if (distance) distance = distance.getElementsByTagName("text")[0];
      if (distance) distance = distance.childNodes[0];
      if (distance) distance = distance.nodeValue;
      output += distance;
      output += ")<br />";
    }

    document.getElementById("directions").innerHTML = output;
}
