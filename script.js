var origin;
var destination;
var arrival;
var arriveBy;

function getDirections() {
  if (!document.getElementById("origin").checkValidity() ||
      !document.getElementById("destination").checkValidity() ||
      !document.getElementById("arrivalTime").checkValidity()) {
        alert("Invalid input");
        return;
  }
  origin = document.getElementById("origin").value;
  destination = document.getElementById("destination").value;
  arrival = document.getElementById("arrivalTime").value;

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
    arriveBy = new Date();
    arriveBy.setHours(arrival.split(":")[0],arrival.split(":")[1]);
    var url = "https://maps.googleapis.com/maps/api/directions/xml?mode=transit&origin=" + origin +
        "&destination=" + destination + "&arrival_time="+ Math.round(arriveBy.getTime()/1000) + "&key=AIzaSyCB-qlxUnHSrGp0aWoN-oojLpRox6lcqY8";
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

    var departureLocation = xml.getElementsByTagName("start_address")[0];
    if (departureLocation) departureLocation = departureLocation.innerHTML;
    var departureTime = xml.getElementsByTagName("departure_time")[xml.getElementsByTagName("departure_time").length-1];
    if (departureTime) departureTime = departureTime.getElementsByTagName("text")[0];
    if (departureTime) departureTime = departureTime.innerHTML;

    output += '<i class="material-icons">location_on</i>';
    output += "Leave " + departureLocation + " at " + departureTime + "<br />";

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
      if (travelMode == "TRANSIT") {
        output += "Wait at ";
        var stop = direction.getElementsByTagName("departure_stop")[0];
        if (stop) stop = stop.getElementsByTagName("name")[0];
        if (stop) stop = stop.innerHTML;
        output += stop + ". ";
      }
      var instruction = direction.getElementsByTagName("html_instructions")[0];
      if (instruction) instruction = instruction.childNodes[0];
      if (instruction) instruction = instruction.nodeValue;
      output += instruction;
      if (travelMode == "TRANSIT") {
        output += ". Get off at ";
        var stop = direction.getElementsByTagName("arrival_stop")[0];
        if (stop) stop = stop.getElementsByTagName("name")[0];
        if (stop) stop = stop.innerHTML;
        output += stop;
      }
      output += ". (";
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

    var arrivalLocation = xml.getElementsByTagName("end_address")[0];
    if (arrivalLocation) arrivalLocation = arrivalLocation.innerHTML;
    var arrivalTime = xml.getElementsByTagName("arrival_time")[xml.getElementsByTagName("arrival_time").length-1];
    if (arrivalTime) arrivalTime = arrivalTime.getElementsByTagName("text")[0];
    if (arrivalTime) arrivalTime = arrivalTime.innerHTML;
    output += '<i class="material-icons">pin_drop</i>';
    output += "Arrive at " + arrivalLocation + " at " + arrivalTime + "<br />";

    var gCopyrightText = xml.getElementsByTagName("route")[0];
    if (gCopyrightText) gCopyrightText = gCopyrightText.getElementsByTagName("copyrights")[0];
    if (gCopyrightText) gCopyrightText = gCopyrightText.innerHTML;
    output += gCopyrightText;

    document.getElementById("directions").innerHTML = output;
}
