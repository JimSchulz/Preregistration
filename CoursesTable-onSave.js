// CoursesTable - onSave

var actionAskConfirm = null;
var actionSave = 1;
var actionCancel = 2;
var result = true;  // Do not call default save after 

if ($CoursesTable.myAction == actionAskConfirm ) {

  // We want confirmation if save button is clicked
  
  alert("Are you sure you want to save these changes?",
    { prompts:
      [
        { label:"OK",
          action:function() {
            $CoursesTable.myAction = actionSave;
            $CoursesTable.$save();
          }
        },
        { label:"Cancel",
          action:function() {
            $CoursesTable.myAction = actionCancel;
            $CoursesTable.$save();
          }
        }
      ]
    }
  );

}
else if ($CoursesTable.myAction == actionSave) {  
  result = false;  // Call default save after onSave
}
 
// Reset to ask save confirmation
$CoursesTable.myAction = actionAskConfirm ;
return result;
