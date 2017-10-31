// SearchTermSelect - onUpdate

// Indicate SearchBlockSelect and SearchInstructorSelect are loading
document.getElementById('pbid-SearchBlockSelect').options[0].text = 'Loading...';

// Load SearchBlockSelect and SearchInstructorSelect select lists
$SearchBlockSelect.$load({clearCache:true});