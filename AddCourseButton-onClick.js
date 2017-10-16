// AddCourseButton - onClick

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

// CRN database edits
$PreRegTerm = document.getElementById('pbid-PreRegTerm').value;
document.getElementById('pbid-AddCourseEdits').value = '';
$AddCourseEdits = '';
$AddCourseEdits.$load({clearCache:true});

waitForAddCourseEdits();


function waitForAddCourseEdits() {

  // The waitForAddCourseEdits function calls the areAddCourseEditsLoaded function
  // We do this to make JavaScript waits for the completion of the DB calls ($load)

  var promise = areAddCourseEditsLoaded();
  promise.then(function(result) {

    // Promise fulfilled.  Database AddCourseEdits variable has completed its load.
    
    // Debug
    //alert("AddCourseEdits=" + document.getElementById('pbid-AddCourseEdits').value,{flash:true});

    // Invalid CRN edit
    if (document.getElementById('pbid-AddCourseEdits').value == '0') {
      document.getElementById('pbid-AddCourseEdits').value = 'Invalid CRN';
    }

    // No errors edit
    if (document.getElementById('pbid-AddCourseEdits').value == '1') {
      document.getElementById('pbid-AddCourseEdits').value = '';
    }

    // Display any CRN edit messages
    if (document.getElementById('pbid-AddCourseEdits').value > '') {
      alert(document.getElementById('pbid-AddCourseEdits').value,{flash: true,type:"error"});
      document.getElementById('pbid-ClassCRN').focus();
      return;
    }

    // Load consent PINs
    $ConsentRequired.$load({clearCache:true});
    $InstructorPIN.$load({clearCache:true});
    $DepartmentPIN.$load({clearCache:true});

    waitForPinsLoads();

  });
}

function areAddCourseEditsLoaded() {  // See if the AddCourseEdits variable is loaded
  var deferred = $.Deferred();
  var nextStep = function() {
    if ($AddCourseEdits == '') {
      // AddCourseEdits are not loaded yet, wait a little more.
      setTimeout(nextStep, 100); 
    }
    else {
      // AddCourseEdits have loaded
      deferred.resolve("AddCourseEdits Loaded");
    }
  }
  nextStep();
  return deferred.promise();
}

function waitForPinsLoads() {

  // The waitForPinsLoads function calls the arePinsLoaded function
  // We do this to make JavaScript waits for the completion of the DB calls ($load)

  var promise = arePinsLoaded();
  promise.then(function(result) {

    // Promise fulfilled.  Database PIN variables have completed their loads.

    if (document.getElementById('pbid-ConsentRequired').value == 'D') {
    
      // Department consent is required

      if (document.getElementById('pbid-DepartmentPIN').value == '') {
        alert("Department consent is required for this CRN, but this subject has no passcode. Please contact the Registrar.",{flash: true,type:"error"});
        return;
      }
      if (document.getElementById('pbid-ClassConsent').value == '') {
        alert("Department consent is required for this CRN. Please enter the Consent Passcode.",{flash: true,type:"error"});
        return;
      }
      if (document.getElementById('pbid-ClassConsent').value != document.getElementById('pbid-DepartmentPIN').value) {
        alert("Department consent is required for this CRN and the Consent Passcode you entered is not the right one.",{flash: true,type:"error"});
        return;
      }
    }

    if (document.getElementById('pbid-ConsentRequired').value == 'I') {
    
      // Instructor consent is required

      if (document.getElementById('pbid-InstructorPIN').value == '') {
        alert("Instructor consent is required for this CRN, but this instructor has no passcode. Please contact the Registrar.",{flash: true,type:"error"});
        return;
      }
      if (document.getElementById('pbid-ClassConsent').value == '') {
        alert("Instructor consent is required for this CRN. Please enter the Consent Passcode.",{flash: true,type:"error"});
        return;
      }
      if (document.getElementById('pbid-ClassConsent').value != document.getElementById('pbid-InstructorPIN').value) {
        alert("Instructor consent is required for this CRN and the Consent Passcode you entered is not the right one.",{flash: true,type:"error"});
        return;
      }
    }

    // All edits have passed. Add the preregistration course.

    // Procedure call - Add Check - This checks the course being added
    $addClass.$post({  // ---------- addClass Post
      stu_pidm: $PassPIDM,
      term_code: document.getElementById('pbid-PreRegTerm').value,
      crn: crn
    },
    null,
    function(response) {  // ---------- addClass Success

      // Success!

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

  });  // promise.then Close

}      // waitForPinsLoads() Close

function arePinsLoaded() {  // See if the PIN variables are loaded
  var deferred2 = $.Deferred();
  var nextStep2 = function() {
    if ($ConsentRequired == null || $InstructorPIN == null || $DepartmentPIN == null) {
      // PIN variables are not loaded yet, wait a little more.
      setTimeout(nextStep2, 100); 
    }
    else {
      // PIN variables have loaded
      deferred2.resolve("PIN Variables Loaded");
    }
  }
  nextStep2();
  return deferred2.promise();
}
