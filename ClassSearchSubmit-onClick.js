// ClassSearchSubmit - onClick

// Edits

if (document.getElementById('pbid-SearchTermSelect').options.selectedIndex == 0)  {
  alert("Please select a term.", {flash: true,type:"error"});
  document.getElementById('pbid-SearchTermSelect').focus();
  return;
}

// Show the AddGrid
$BlockCourseAdd.$visible = true;

document.getElementById("pbid-CourseAddSearchLabel").innerHTML = "Loading...";

$AddGrid.$load({clearCache:true});