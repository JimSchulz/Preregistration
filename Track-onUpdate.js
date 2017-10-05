// Track - onUpdate

// Update Total Points value

var i = 0;
var j = document.getElementById('pbid-TotalPointsIndex').value;
var points = 0;
var pointTotal = 0;
var allocated = 0;
var trk;
var trackCount = 0;

for (i=0; i<j; i++) {

  // Numeric Input Only
  points = document.getElementById('pbid-Points-' + i).value.replace(/[^0-9]/g,'');
  if (points == '') {
    points = 0;
  }
  points = parseInt(points);
  document.getElementById('pbid-Points-' + i).value = points;

  pointTotal = pointTotal + points;  // Sum points

  // See if each course has an allocated point value
  if (document.getElementById('pbid-Points-' + i).value > 0) {
    allocated++;
  }

  // See if each Grading Track has been selected
  trk = document.getElementById("pbid-Track-" + i);
  if (trk.options[trk.selectedIndex].text > "") {
    trackCount++;
  }
}

// Each course needs to have at least one point allocated
if (allocated < j) {
  waitForIt();
}

// Each course needs to have a chosen Grading Track
if (trackCount < j) {
  waitForIt();
}

document.getElementById('pbid-Points-' + j).value = pointTotal;  // Update Total Points

// Change points total red if points total value goes over MaxPoints
// and deactivate the Save Changes button
if (pointTotal > document.getElementById('pbid-MaxPoints').value) {
  document.getElementById('pbid-Points-' + j).style.color = 'red';
  waitForIt();
}
else {
  document.getElementById('pbid-Points-' + j).style.color = 'black';
  document.getElementById('pbid-CoursesTable-save-button').disabled = false;
}

// Allow time for the CoursesTable's Save Changes button to finish its initial activation
function waitForIt() {
  paws = setTimeout(go, 100);
}

// Go - Deactivate the Save Changes button
function go() {
  document.getElementById('pbid-CoursesTable-save-button').disabled = true;
}