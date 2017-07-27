// CoursesUpdate - onClick

// Validate allocated course points
if (parseInt(document.getElementById('pbid-Points-' + document.getElementById('pbid-TotalPointsIndex').value).value) > parseInt(document.getElementById('pbid-MaxPoints').value)) {
	confirm("Too many points allocated (" + document.getElementById('pbid-Points-' + document.getElementById('pbid-TotalPointsIndex').value).value + "). Maximum point count for this term is " + document.getElementById('pbid-MaxPoints').value + '.');
	return;
}