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
  $BlockNull04.$visible = false;
  $BlockClassSearch.$visible = false;
  $BlockNull05.$visible = false;
  $BlockCourseAdd.$visible = false;
}
else {
  // Hide all Blocks
  $BlockNull02.$visible = false;
  $BlockAddClasses.$visible = false;
  $BlockNull03.$visible = false;
  $BlockStuCourses.$visible = false;
}