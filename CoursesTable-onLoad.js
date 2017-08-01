// CoursesTable - onLoad

var rows = $CoursesTable.$data.length;
var row = 0;
var paws;
var j = 0;
var k = 0;
var points = 0;

// Initially Hide the CoursesTable buttons
document.getElementById('pbid-CoursesUpdate').style.display = 'none';
document.getElementById('pbid-CoursesReset').style.display = 'none';

// Populate Track select labels and values
$Track.$load();

waitForIt();

// Allow time for the database call to finish
function waitForIt() {
  paws = setTimeout(go, 200);
}

// Go
function go() {
  for (row=0; row<rows; row++) {
    // Remove readonly attribute on Points input text objects
    document.getElementById('pbid-Points-' + row).removeAttribute('readonly');
    points = points + parseInt(document.getElementById('pbid-Points-' + row).value);
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
  $BlockNull02.$visible = true;
  $BlockAddClasses.$visible = true;

  // Show or Hide the Student Courses Block
  if (j > 0) {
    $BlockNull03.$visible = true;
    $BlockStuCourses.$visible = true;
  }
  else {
    $BlockNull03.$visible = false;
    $BlockStuCourses.$visible = false;
    alert("No preregistration records found.",{flash:true});
  }

  document.getElementById('pbid-UserButton').click();
}