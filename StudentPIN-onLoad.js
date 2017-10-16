// StudentPIN - onLoad

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
$BlockNull03.$visible = false;

// Load the goods
$AddEntryStuName.$load({clearCache:true});
$AddEntryStuClass.$load({clearCache:true});
$CoursesTable.$load({clearCache:true});

// Show these Blocks
$BlockAddClasses.$visible = true;
$BlockNull04.$visible = true;
$BlockStuCourses.$visible = true;
$BlockNull05.$visible = true;