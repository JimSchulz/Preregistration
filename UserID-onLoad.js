// UserID - onLoad

var userType = '';
var auth = '';
var paws;
var today = new Date();
var endDate;

// Initially, hide the PreRegInstructions and show the BlockPreRegInstructions
document.getElementById("pbid-PreRegInstructions").style.display = "none";
$BlockPreRegInstructions.$visible = true;
$BlockNull01.$visible = true;

// Initially, hide the PreRegClosed Literal
document.getElementById('pbid-PreRegClosed').style.display = 'none';

// Get the Preregistration Term
$PreRegType.$load({clearCache:true});
$PreRegTerm.$load({clearCache:true});
$PreRegEndDate.$load({clearCache:true});
$MaxPoints.$load({clearCache:true});

waitForIt();

// We pause a moment to allow DB retrieval time to complete
function waitForIt() {
  paws = setTimeout(go, 300);
}

function go() {

  // Debug
  //alert("Type=" + document.getElementById('pbid-PreRegType').value,{flash:true});
  //alert("Term=" + document.getElementById('pbid-PreRegTerm').value,{flash:true});
  //alert("EndDate=" + document.getElementById('pbid-PreRegEndDate').value,{flash:true});
  //alert("MaxPoints=" + document.getElementById('pbid-MaxPoints').value,{flash:true});

  var term = document.getElementById('pbid-PreRegTerm').value.substring(4,6);
  var endDate = new Date(document.getElementById('pbid-PreRegEndDate').value);
  
  // Values in below if statement come from GTVSDAX

  if (document.getElementById('pbid-PreRegTerm').value.length == 6 &&  // PreRegTerm has 6 characters
      !isNaN(document.getElementById('pbid-PreRegTerm').value)     &&  // PreRegTerm is numeric
      !isNaN(document.getElementById('pbid-MaxPoints').value)      &&  // MaxPoints is numeric
      endDate >= today &&                                              // PreRegEndDate > Current Date
      (term == '10' || term == '20' || term == '30')) {                // The term is 10, 20 or 30

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
      $BlockNull02.$visible = true;
      document.getElementById("pbid-UserSource").value = 'R';  // Registrars or Dev User
      document.getElementById('pbid-UserButton').click();
    }
    else if (userType == 'Stu') {

      // Hide the student lookup block
      $BlockStuLookup.$visible = false;
      $BlockNull02.$visible = false;

      // Show the Preregistration Passcode block
      $StuPreRegPasscodeBlock.$visible = true;
      $BlockNull03.$visible = true;

      // Prep data
      document.getElementById("pbid-UserSource").value = 'S';  // Student User
      var userSource = 'S';
      document.getElementById('pbid-UserButton').click();

      // The FirstFunction gets the user's pidm
      function firstFunction() {
        var deferred = $.Deferred();
        var nextStep = function() {
          if ($UserPIDM == null) {
            $UserPIDM.$load();
            setTimeout(nextStep, 100); 
          }
          else {
            $PassPIDM = document.getElementById('pbid-UserPIDM').value;
            deferred.resolve(i);
          }
        }
        nextStep();
        return deferred.promise();
      }

      // The SecondFunction calls the FirstFunction
      // We do this to make JavaScript wait for completion of the $UserPIDM.$load DB call
      function secondFunction() {
        var promise = firstFunction();
        promise.then(function(result) {
          document.getElementById('pbid-PassPIDM').value = document.getElementById('pbid-UserPIDM').value;
        });
      }

      secondFunction();
    }
    else {
      document.getElementById("pbid-UserSource").value = null;  // Not Allowed

      // Hide the student lookup block
      $BlockStuLookup.$visible = false;
      $BlockNull02.$visible = false;

      alert("You're not authorized to use the Preregistration application.",{type:"error"});
    }
  }
  else {

    // Preregistration is Closed

    // Show the Closed message
    document.getElementById('pbid-PreRegClosed').style.display = 'block';

    // Hide Preregistration Instruction Objects
    document.getElementById("pbid-PreRegButton").style.display = "none";
    document.getElementById("pbid-PreRegInfo").style.display = "none";
    document.getElementById("pbid-PreRegInstructions").style.display = "none";

    // Hide All Blocks
    $BlockStuLookup.$visible = false;
    $BlockNull02.$visible = false;
    $StuPreRegPasscodeBlock = false;
    $BlockNull03.$visible = false;
    $BlockAddClasses.$visible = false;
    $BlockNull04.$visible = false;
    $BlockStuCourses.$visible = false;
    $BlockNull05.$visible = false;
    $BlockClassSearch.$visible = false;
    $BlockNull06.$visible = false;
    $BlockCourseAdd.$visible = false;

  }
} // function go