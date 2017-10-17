// CoursesTable - onLoad

var rows = $CoursesTable.$data.length;
var row = 0;
var paws;
var j = 0;
var k = 0;
var points = 0;

// Populate Track select labels and values
$Track.$load();

waitForIt();

// Allow time for the database call to finish
function waitForIt() {
  paws = setTimeout(go, 300);
}

// Go
function go() {
  for (row=0; row<rows; row++) {

    // Remove readonly attribute on Points input text objects
    document.getElementById('pbid-Points-' + row).removeAttribute('readonly');

    // Total the points for the Total Points line
    points = points + parseInt(document.getElementById('pbid-Points-' + row).value);

    // Convert null to zero
    if (document.getElementById('pbid-Points-' + row).value == '') {
      document.getElementById('pbid-Points-' + row).value = 0;
    }
  }

  // Set Styling of Points Total Line
  j = row - 1;
  document.getElementById('pbid-Track-' + j).style.display = 'none';
  document.getElementById('pbid-CoursesTabledelete-column-checkbox-' + j).style.display = 'none';
  document.getElementById('pbid-Block-' + j).style.fontWeight = 'bold';  // "Total" text
  document.getElementById('pbid-Block-' + j).style.fontSize = '115%';
  document.getElementById('pbid-Points-' + j).readOnly = true;  // Points Total Styling
  document.getElementById('pbid-Points-' + j).style.border = '0px';
  document.getElementById('pbid-Points-' + j).style.boxShadow = 'inset 4px 4px 4px #FFFFFF';
  document.getElementById('pbid-Points-' + j).style.fontWeight = 'bold';
  document.getElementById('pbid-Points-' + j).style.fontSize = '115%';
  document.getElementById('pbid-Points-' + j).style.paddingBottom = '14px';
  document.getElementById('pbid-Points-' + j).style.paddingRight = '21px';

  // Save the Total Points Index
  document.getElementById('pbid-TotalPointsIndex').value = j;

  // Show the Add Classes Block
  $BlockAddClasses.$visible = true;
  $BlockNull04.$visible = true;

  // Show or Hide the Student Courses Block
  if (j > 0) {
    $BlockStuCourses.$visible = true;
    $BlockNull05.$visible = true;
  }
  else {
    $BlockStuCourses.$visible = false;
    $BlockNull05.$visible = false;
    alert("No preregistration records found.",{flash:true});
  }

  document.getElementById('pbid-UserButton').click();

  loopForever();
}

function loopForever() {
  paws = setTimeout(getRowCount, 250);
}

function getRowCount() {

  // This function checks to see if a row from the $CoursesTable has been deleted.
  // If a row has been deleted, then update the Total Points value.

  if (document.getElementById('pbid-TotalPointsIndex').value != $CoursesTable.$data.length - 1) {

    // Retotal the total point values
    rows = $CoursesTable.$data.length;
    row = 0;
    points = 0;
    for (row=0; row<rows-1; row++) {
      if (document.getElementById('pbid-Points-' + row).value == '') {
        // Convert null to zero
        document.getElementById('pbid-Points-' + row).value = 0;
      }
      points = points + parseInt(document.getElementById('pbid-Points-' + row).value);
    }

    // Save the Total Points Index
    j = $CoursesTable.$data.length - 1;
    document.getElementById('pbid-TotalPointsIndex').value = j;

    // Update Total Points
    document.getElementById('pbid-Points-' + j).value = points;
  }

  loopForever();
}