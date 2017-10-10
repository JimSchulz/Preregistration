// SearchClassSchedule - onClick

// Show/Hide the Class Schedule search section

if ($BlockClassSearch.$visible == false) {
  $BlockClassSearch.$visible = true;
  $BlockNull06.$visible = true;
  $BlockCourseAdd.$visible = true;
  $SearchTermSelect.$load({clearCache:true});
  $SearchSubjectSelect.$load({clearCache:true});
  $SearchBlockSelect.$load({clearCache:true});
  $SearchInstructorSelect.$load({clearCache:true});
  $SearchDegReqSelect.$load({clearCache:true});
  $SearchCampusSelect.$load({clearCache:true});
  alert("Class Schedule form displayed below.", {flash: true});
}
else {
  $BlockClassSearch.$visible = false;
  $BlockNull06.$visible = false;
  $BlockCourseAdd.$visible = false;
}