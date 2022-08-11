/**************************************************************/
// reg_manager.js
//
// Test registration page
// Written by Mr Bob 2020
// v01 Initial code
// v02 Include reg_getFormItemValue function in reg_manager.js 
// v03 Add reg_prep function
// v04 Add conversion from string to number for numeric feilds
// v05 Cut down version
/**************************************************************/      

/**************************************************************/
// reg_regDetailsEntered()
// Input event; called when user clicks ?????????? button             
// Write user's details to DB
// Input:   
// Return:
/**************************************************************/
function reg_regDetailsEntered() {
  
  // Getting the Details from the form
  userDetails.userName     =        reg_getFormItemValue("f_reg", 0);
  userDetails.phone        = Number(reg_getFormItemValue("f_reg", 1));
  userDetails.country      =        reg_getFormItemValue("f_reg", 2);
  userDetails.city         =        reg_getFormItemValue("f_reg", 3);
  userDetails.postCode     = Number(reg_getFormItemValue("f_reg", 4));
  userDetails.streetNum    = Number(reg_getFormItemValue("f_reg", 5));
  userDetails.streetName   =        reg_getFormItemValue("f_reg", 6); 
  userDetails.age          =        reg_getFormItemValue("f_reg", 7)

  if (document.getElementById('f_reg').checkValidity()) {
    // Writing these Details to the Database
    fb_writeRec(DETAILS, userDetails.uid, userDetails);

    console.log("User is Registered, Now showing game page.")

    $("#s_registerP").fadeOut(400, function () { }); // Fading out Landing

    setTimeout(function () {
      $("#s_lobbyP").fadeIn(500, function () { }); // fading Game page in
    }, 1500); // Waiting for a certain of time before fading.
  }
 
}

/**************************************************************/
// reg_getFormItemValue(_elementId, _item)
// Called by reg_regDetailsEntered
// Returns the value of the form's item
// Input:  element id & form item number
// Return: form item's value
/**************************************************************/
function reg_getFormItemValue(_elementId, _item) {
  //console.log('reg_getFormItemValue: _elementId=' + _elementId +
  //	  ',  _item= ' + _item);
    
  return document.getElementById(_elementId).elements.item(_item).value;
}

/**************************************************************/
//    END OF PROG
/**************************************************************/