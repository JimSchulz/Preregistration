// StuSelect - onUpdate

// Selected student is changing

// Assign chosen student's values
var stuSelect = $StuSelect.$selected?$StuSelect.$selected. STU_PIDM:null;
$PassPIDM = $StuSelect.$selected?$StuSelect.$selected. STU_PIDM:null;
var userSource = document.getElementById('pbid-UserSource').value;

if (stuSelect != null) {
  $AddEntryStuName.$load({clearCache:true});
  $AddEntryStuClass.$load({clearCache:true});
  $CoursesTable.$load({clearCache:true});
  $BlockClassSearch.$visible = false;
  $BlockCourseAdd.$visible = false;
  document.getElementById('pbid-ClassCRN').value = '';
  document.getElementById('pbid-ClassConsent').value = '';
}
else {
  // Hide all Blocks
  $BlockAddClasses.$visible = false;
  $BlockStuCourses.$visible = false;
  $BlockClassSearch.$visible = false;
  $BlockCourseAdd.$visible = false;
}
