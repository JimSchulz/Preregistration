// StuPreRegPasscodeButton - onClick

var paws;

// Passcode database edits
$PreRegTerm = document.getElementById('pbid-PreRegTerm').value;
$StudentPIN.$load({clearCache:true});

waitForStudentPIN();


function waitForStudentPIN() {

  // The waitForStudentPIN function calls the isStudentPINLoaded function
  // We do this to make JavaScript wait for the completion of the DB calls ($load)

  var promise = isStudentPINLoaded();
  promise.then(function(result) {
    
    // Promise fulfilled.  Database myVariable has completed its load.
    
    // Debug
    //alert("StudentPIN=" + document.getElementById('pbid-StudentPIN').value,{flash:true});

    // Instructor Consent edit
    if (document.getElementById('pbid-StudentPIN').value > '') {
      if (document.getElementById('pbid-StuPreRegPasscode').value == '') {
        alert("A Preregistration Passcode is required.",{flash: true,type:"error"});
        return;
      }
      if (document.getElementById('pbid-StuPreRegPasscode').value != document.getElementById('pbid-StudentPIN').value) {
        alert("The Preregistration Passcode you entered was not correct.",{flash: true,type:"error"});
        return;
      }
    }

    // The preregistration password was correct.

    // Hide the Student Preregistration Passcode block
    $StuPreRegPasscodeBlock.$visible = false;

    // Load the goods
    $AddEntryStuName.$load({clearCache:true});
    $AddEntryStuClass.$load({clearCache:true});
    $CoursesTable.$load({clearCache:true});

    // Show these Blocks
    $BlockAddClasses.$visible = true;
    $BlockStuCourses.$visible = true;
  });
}

function isStudentPINLoaded() {  // See if the StudentPIN is loaded
  var deferred = $.Deferred();
  var nextStep = function() {
    if ($StudentPIN == null) {
      // StudentPIN is not loaded yet, wait a little more.
      setTimeout(nextStep, 100); 
    }
    else {
      // StudentPIN has loaded
      deferred.resolve("StudentPIN Loaded");
    }
  }
  nextStep();
  return deferred.promise();
}
