// AddCourseButton - onClick

var paws;

// Retrieve input values from the Class form
var crn = document.getElementById('pbid-ClassCRN').value;

// Remove the value "string:" which was prefixed via the Class Schedule Search process
var crn = crn.substring(crn.indexOf(":")+1,crn.length);

// CRN maximum value edit
if (crn.length > 5) {
  alert("CRN value is greater than 5 digits.",{flash: true,type:"error"});
  return;
}

// Make the ClassCRN field read-only during this transaction session
document.getElementById('pbid-ClassCRN').readOnly = true;

// Procedure call - Add Check - This checks the course being added
$addClass.$post({  // ---------- addClass Post
  stu_pidm: $PassPIDM,
  term_code: document.getElementById('pbid-PreRegTerm').value,
  crn: crn
},
null,
function(response) {  // ---------- addClass Success
  // Success!

  // Get add course messages
  $Messages.$load({clearCache:true});

  // Wait for Messages to load
  waitForIt();
},
function(response) {  // ---------- addClass Error
  var errorMessage = response.data.errors?response.data.errors.errorMessage:null;

  if (response.data.errors.errorMessage) {
    errorMsg = response.data.errors.errorMessage;
  }
  else if (response.data.errors[0].errorMessage) {
    errorMsg = response.data.errors[0].errorMessage;
  } 
  else {
    errorMsg = errorMessage?errorMessage:response.data;
  }
  if (errorMsg) {
    alert("addClass Error: " + errorMsg,{type:"error"});  // Display Error
    return;
  }

});  // ---------- addClass Close

// Allow time for the $Messages database call to finish
function waitForIt() {
  paws = setTimeout(go, 100);
}

// Go
function go() {

  // Display Messages
  if (document.getElementById('pbid-Messages').value) {
    alert(document.getElementById('pbid-Messages').value,{type:"error"});
  }

  // Make the ClassCRN field accessible
  document.getElementById('pbid-ClassCRN').readOnly = false;

  // Reset the CRN input
  document.getElementById('pbid-ClassCRN').value = '';

  // Reload the CoursesTable from the database
  $CoursesTable.$load({clearCache:true});

  alert("Preregistration Course Added",{flash:true});
}