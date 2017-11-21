// UserID - onLoad

var userType = '';
var auth = '';
var today = new Date();
var endDate;
var term = '';
var maxPoints = '';
var termOK = true;
var maxPointsOK = true;

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// IE Browser Test
if (isIE) {
  alert("This applicaiton does not support Internet Explorer.  Please choose a different browser.",{flash:true});
  return;
}

// Initially, hide the PreRegInstructions and show the BlockPreRegTitle
document.getElementById("pbid-PreRegInstructions").style.display = "none";
$BlockPreRegInstructions.$visible = true;

// Initially, hide the PreRegClosed Literal
document.getElementById('pbid-PreRegClosed').value = '';
document.getElementById('pbid-PreRegClosed').style.display = 'none';

// Get the Preregistration Term variables (GTVSDAX)
$PreRegType.$load({clearCache:true});
$PreRegTerm.$load({clearCache:true});
$PreRegEndDate.$load({clearCache:true});
$MaxPoints.$load({clearCache:true});

waitForTermVars();

function waitForTermVars() {

  // The waitForTermVars function calls the areTermVarsLoaded function
  // We do this to make JavaScript waits for the completion of the DB $load calls

  var promise = areTermVarsLoaded();
  promise.then(function(result) {

    // Promise fulfilled.  Database Term variables have completed their load.
    
    // Debug
    //alert("PreRegType=" + document.getElementById('pbid-PreRegType').value,{flash:true});
    //alert("PreRegTerm=" + document.getElementById('pbid-PreRegTerm').value,{flash:true});
    //alert("PreRegEndDate=" + document.getElementById('pbid-PreRegEndDate').value,{flash:true});
    //alert("MaxPoints=" + document.getElementById('pbid-MaxPoints').value,{flash:true});

    // Load GTVSDAX variables
    term = document.getElementById('pbid-PreRegTerm').value;
    maxPoints = document.getElementById('pbid-MaxPoints').value;
    var endDate = new Date(document.getElementById('pbid-PreRegEndDate').value);

    // Check GTVSDAX Term
    if (term.length == 4) {
      if (isNaN(term)) {
        termOK = false;
      }
    }
    else if (term.length == 6) {
      if (isNaN(term)) {
        termOK = false;
      }
      else if (term.substring(4,6) != '10' && term.substring(4,6) != '20' && term.substring(4,6) != '30') {
        termOK = false;
      }
    }
    else {
      termOK = false;
    }

    // Check GTVSDAX Max Points
    if (maxPoints.length == 2) {
      if (isNaN(maxPoints)) {
        maxPointsOK = false;
      }
    }
    else {
      maxPointsOK = false;
    }

    // Debug
    //alert("term=" + term,{flash:true});
    //alert("maxPoints=" + maxPoints,{flash:true});
    //alert("termOK=" + termOK,{flash:true});
    //alert("maxPointsOK=" + maxPointsOK,{flash:true});

    if (termOK && maxPointsOK && endDate >= today) {

      // Preregistration is Open

      // Determine what kind of user is signing on (Web Tailor)
      for (i=0; i<$$user.authorities.length; i++) {
        auth = $$user.authorities[i].objectName;
        //alert(auth,{flash:true});  // Helpful Debug - Shows user's WebTailor Roles
        if (auth.indexOf('WTAILORADMIN') > -1) {  // was GPBADMN
          userType = "Dev";
        }
        if (auth.indexOf('REGISTRAR') > -1) {
          userType = "Reg";
        }
        if (auth.indexOf('STUDENT') > -1) {
          userType = "Stu";
        }
      }

      if (userType == 'Reg' || userType == 'Dev') {

        // Show the student lookup block
        $BlockStuLookup.$visible = true;
        document.getElementById("pbid-UserSource").value = 'R';  // Registrars or Dev User
        document.getElementById('pbid-UserButton').click();
      }
      else if (userType == 'Stu') {

        // Hide the student lookup block
        $BlockStuLookup.$visible = false;

        // Show the Preregistration Passcode block
        $StuPreRegPasscodeBlock.$visible = true;

        // Prep data
        document.getElementById("pbid-UserSource").value = 'S';  // Student User
        var userSource = 'S';
        document.getElementById('pbid-UserButton').click();

        // Load the student user PIDM
        $UserPIDM.$load();

        waitForUserPidmVar();

      }
      else {
        document.getElementById("pbid-UserSource").value = null;  // User Not Allowed

        // Hide the student lookup block
        $BlockStuLookup.$visible = false;

        alert("Sorry, you're not authorized to use the Preregistration application.",{type:"error"});
      }

    }
    else {

      // Preregistration is Closed

      // Show the Preregistration Closed message
      document.getElementById('pbid-PreRegClosed').value = 'Preregistration is closed.';
      document.getElementById('pbid-PreRegClosed').style.display = 'block';

      // Hide Preregistration Instruction Objects
      document.getElementById("pbid-PreRegButton").style.display = "none";
      document.getElementById("pbid-PreRegInstructions").style.display = "none";

      // Hide All Blocks
      $BlockStuLookup.$visible = false;
      $StuPreRegPasscodeBlock = false;
      $BlockAddClasses.$visible = false;
      $BlockStuCourses.$visible = false;
      $BlockClassSearch.$visible = false;
      $BlockCourseAdd.$visible = false;
    }

  });

}  // function waitForTermVars()

function areTermVarsLoaded() {  // See if term variables are loaded
  var deferred1 = $.Deferred();
  var nextStep1 = function() {
    if ($PreRegType == null || $PreRegTerm == null || $PreRegEndDate == null || $MaxPoints == null) {
      // Term variables have not loaded yet, wait a little more.
      setTimeout(nextStep1, 100); 
    }
    else {
      // Term variables have loaded
      deferred1.resolve("Term Variables Loaded");
    }
  }
  nextStep1();
  return deferred1.promise();
}

function waitForUserPidmVar() {

  // The waitForUserPidmVar function calls the isUserPidmVarLoaded function
  // We do this to make JavaScript waits for the completion of the DB calls ($load)

  var promise = isUserPidmVarLoaded();
  promise.then(function(result) {
    // Promise fulfilled.  Database UserPIDM variable has completed its load.
    document.getElementById('pbid-PassPIDM').value = document.getElementById('pbid-UserPIDM').value;
  });
}

function isUserPidmVarLoaded() {  // See if the UserPIDM variable is loaded
  var deferred2 = $.Deferred();
  var nextStep2 = function() {
    if ($UserPIDM == null) {
      // UserPIDM variable is not loaded yet, wait a little more.
      setTimeout(nextStep2, 100); 
    }
    else {
      // UserPIDM has loaded
      $PassPIDM = document.getElementById('pbid-UserPIDM').value;
      deferred2.resolve("UserPIDM Loaded");
    }
  }
  nextStep2();
  return deferred2.promise();
}
