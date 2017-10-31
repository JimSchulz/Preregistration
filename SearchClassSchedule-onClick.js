// SearchClassSchedule - onClick

// Show the Class Schedule search block and hide the Course Add and Course Drop blocks

if ($BlockClassSearch.$visible == false) {
  $BlockAddClasses.$visible = false;
  $BlockStuCourses.$visible = false;
  $BlockClassSearch.$visible = true;
  $SearchTermSelect.$load({clearCache:true});
  $SearchSubjectSelect.$load({clearCache:true});
  $SearchDegReqSelect.$load({clearCache:true});
  $SearchCampusSelect.$load({clearCache:true});
}
