// AddCourseButton - onClick

var paws;

// Retrieve input values from the Class form
var crn = document.getElementById('pbid-ClassCRN').value;

// Remove the value "string:" which was prefixed via the Class Schedule Search process
var crn = crn.substring(crn.indexOf(":")+1,crn.length);

// CRN edits

// CRN null edit
if (crn.length == 0) {
  alert("CRN required.",{flash: true,type:"error"});
  document.getElementById('pbid-ClassCRN').focus();
  return;
}

// CRN numeric edit
if (isNaN(crn)) {
  alert("CRN is not numeric.",{flash: true,type:"error"});
  document.getElementById('pbid-ClassCRN').focus();
  return;
}

// CRN maximum length value edit
if (crn.length > 5) {
  alert("CRN value is greater than 5 digits.",{flash: true,type:"error"});
  document.getElementById('pbid-ClassCRN').focus();
  return;
}

// CRN minimum length value edit
if (crn.length < 5) {
  alert("CRN value is less than 5 digits.",{flash: true,type:"error"});
  document.getElementById('pbid-ClassCRN').focus();
  return;
}

// CRN not within current term
if (crn.substring(0,2) != document.getElementById('pbid-PreRegTerm').value.substring(4,6)) {
  alert("Invalid CRN for preregistration term.",{flash: true,type:"error"});
  document.getElementById('pbid-ClassCRN').focus();
  return;
}

// Make the ClassCRN field read-only during this transaction session
document.getElementById('pbid-ClassCRN').readOnly = true;

// CRN database edits
$PreRegTerm = document.getElementById('pbid-PreRegTerm').value;
$AddCourseEdits.$load({clearCache:true});

waitForIt();


// Allow time for the database call to finish
function waitForIt() {
  paws = setTimeout(go, 200);
}

// Go
function go() {

  // Debug
  //alert("AddCourseEdits=" + document.getElementById('pbid-AddCourseEdits').value,{flash:true});

  // Invalid CRN edit
  if (document.getElementById('pbid-AddCourseEdits').value == '') {
    document.getElementById('pbid-AddCourseEdits').value = 'Invalid CRN';
  }

  // No errors edit
  if (document.getElementById('pbid-AddCourseEdits').value == 'zOK') {
    document.getElementById('pbid-AddCourseEdits').value = '';
  }

  // Display any CRN edit messages
  if (document.getElementById('pbid-AddCourseEdits').value > '') {
    alert(document.getElementById('pbid-AddCourseEdits').value,{flash: true,type:"error"});
    document.getElementById('pbid-ClassCRN').readOnly = false;
    document.getElementById('pbid-ClassCRN').focus();
    return;
  }

  // Load consent PIN
  $InstructorPIN.$load({clearCache:true});

  waitForItAgain();
}

// Allow time for the database call to finish
function waitForItAgain() {
  paws = setTimeout(goAgain, 200);
}

function goAgain() {

  // Instructor Consent edit
  if (document.getElementById('pbid-InstructorPIN').value > '') {
    if (document.getElementById('pbid-ClassConsent').value == '') {
      alert("A Consent Passcode is required for the entered CRN.",{flash: true,type:"error"});
      return;
    }
    if (document.getElementById('pbid-ClassConsent').value != document.getElementById('pbid-InstructorPIN').value) {
      alert("The Consent Passcode you entered was not correct.",{flash: true,type:"error"});
      return;
    }
  }

  // All edits have passed, add preregistration course.

  // Make the ClassCRN field read only
  document.getElementById('pbid-ClassCRN').readOnly = true;
  document.getElementById('pbid-ClassConsent').readOnly = true;

  // Procedure call - Add Check - This checks the course being added
  $addClass.$post({  // ---------- addClass Post
    stu_pidm: $PassPIDM,
    term_code: document.getElementById('pbid-PreRegTerm').value,
    crn: crn
  },
  null,
  function(response) {  // ---------- addClass Success

    // Success!

    // Make the ClassCRN field accessible
    document.getElementById('pbid-ClassCRN').readOnly = false;
    document.getElementById('pbid-ClassConsent').readOnly = false;

    // Reset the CRN input
    document.getElementById('pbid-ClassCRN').value = '';
    document.getElementById('pbid-ClassConsent').value = '';

    // Reload the CoursesTable from the database
    $CoursesTable.$load({clearCache:true});

    alert("Preregistration Course Added",{flash:true});
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
}