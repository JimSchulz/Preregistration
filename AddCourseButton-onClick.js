// AddCourseButton - onClick

// Retrieve input values from the Class form
var crn = document.getElementById('pbid-ClassCRN').value;

// Remove the value "string:" which was prefixed via the Class Schedule Search process.
var crn = crn.substring(crn.indexOf(":")+1,crn.length);

// CRN maximum value edit
if (crn.length > 5) {
  alert("CRN value is greater than 5 digits.",{flash: true,type:"error"});
  return;
}

// Make the ClassCRN field read-only during this transaction session.
document.getElementById('pbid-ClassCRN').readOnly = true;

// Procedure call - Add Check - This checks the course being added
$addClass.$post({  // ---------- addClass Post
  stu_pidm: $PassPIDM,
  term_code: $PreRegTerm,
  crn: crn,
},
null,
function(response) {  // ---------- addClass Success
  // Success!

  // Reload the CoursesTable from the database
  $CoursesTable.$load({clearCache:true});

  alert("Preregistration Course Added!",{flash:true});
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
    // Show the Add and Drop sections and hide the ProcessingData section
    $BlockCourseAddEntry.$visible = true;
    $BlockNull03.$visible = true;
    $BlockCourseDrop.$visible = true;
    $ProcessingData.$visible = false;

    alert("addClass Error: " + errorMsg,{type:"error"});  // Display Error
    return;
  }

});  // ---------- addClass Close