// AddCourse - onUpdate

var rows = $AddGrid.$data.length;
var i = 0;
var k = 0;

// Loop through all AddGrid rows
for (i=0; i<rows; i++) {

  if (document.getElementById("pbid-AddCourse-" + i).checked) {

    // User checked an AddGrid's AddCourse checkbox

    // Set the CRN within the AddEntryForm
    $ClassCRN = $AddGrid.$data[i].CRN;

    // Hide the Class Schedule Search and Class Schedule Search Results blocks
    $BlockClassSearch.$visible = false;
    $BlockNull06.$visible = false;
    $BlockCourseAdd.$visible = false;

    // Reset the Class Search Results form
    document.getElementById("pbid-AddCourse-" + i).click();  // Maintain state of checkbox
    document.getElementById("pbid-CourseAddForm").reset();

    break;
  }
}