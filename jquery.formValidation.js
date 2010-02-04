/////////////////////////////////// TITLE //////////////////////////////////////////////////

// formValidation


/////////////////////////////////// INFO ////////////////////////////////////////////////////
//This library was created by Kim Doberstein
//
// Version 1.2.1beta 
// Date: 02/02/2010
//
// Basic framework for form and form field validation

// NOTE: This library requries the jQuery framework.  It was tested using version 1.4.1
////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// SETTING UP YOUR HTML //////////////////////////////////////
// 
// Any form element that is "required" or should be tested needs to have a  class of "required"
//
//  <input name="text1" type="text" class="required"  />
//
// Note: each radio button in a radio-button group will need have the "required" class

// By default, the FormValidation object will check to see that the form element has a non-empty value.
// Something is entered in a textbox/textarea, a item is selected in a select box, checkbox is checked, and
// at least one radio button in a radio group is selected.

// If you want another kind of validation, you need to add a "dataType" class. Build-in reconginzied
// datatypes and directions on how to add your own dataTypes are listed below.
//
//  <input name="text1" type="text" class="required dataType_email" />

//  By default on a given event ("click","blur","change"), the form element will be validated. 
//  The default event listeners or a given form element type are set at the top of the object.
//  If you want a particular element to be validated on a different  event, you can add the wanted
//  event in a validateEvent  attribute:

//<input name="text1" type="text" class="required dataType_email"  validateEvent="change" />

//////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// WHAT DOES THIS LIBRARY DO - Constructor  ///////////////////////
// First the FormValidation object should be created on page load.  See the START ON PAGE LOAD section
// for an example.

// When created, by default, the object goes through each form element and if it as a "required" class,
// it automatically adds a listener (usually on click or onblur).  When a user interacts with that form element, 
// that single element is validated.  NOTE: the listener type can be changed either by changing the global variable
// at the top of the FormValidation object (not recommended) or by using a series of setter methods.
//
// In addtion, an onsubmit listener is added to the form tag.  When submitted, the form validates each
// form element with a "required" class.  If the all the elements pass validation, the form is sumitted.
// If not, the form is prevented from submitting.  NOTE this object will remove anything set in the "onsubmit" attribute.


//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// BUILT IN DATA TYPES /////////////////////// ///////////////////////
// "nonEmpty" - Default - check to see that the form element has a non-empty value
// "umIDNum" - Checks to see if the user entered 7 numerical charicters
// "date4Year" - Checks to see if the data was entered in the following format: mm/dd/yyyy
// "phone" - Checks to see if the data entered is in the folloing format: xxx-xxx-xxxx.  Note area code is required, but dashes are optional.
// "numerical" - Checks to see if data entered only contains numbers.  If the "numlength" attribute is set, will make sure the length is equal to the "numlength" attribute.
// "email" - Checks to see if data entered is in the format of an email address.
// "currency" - Checks to see if the user entered a dollar ammount - note a "$" before the number is optional as are commas.
// "gpa"- Checks to see if a user entered a vale between 0.00 and 4.00".
//'fourDigitYear'- Checks to see if a user entered nothing or a valid four digit year

//*** Note: the above must start with "dataType_" when added as a class.  See "SETTING UP YOUR HTML" section.


//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// ADDING A DATA TYPE ///////////////////////////////////////////////
//  First you need to creat a function that will be called to validate your new datatype.
// The function must contain only one parameter - a pointer to the form element and it must return a 
// boolean.  True if the element passes, and false if it fails.
//
// EXAMPLE:
// function mustBeKimFunct(field){
//	if(field.value=="Kim") return true;
//	else return false;
//}

// Secondly, there are two ways to have this object call your function.
//
// ADD VIA THE validationDataTypesArray ARRAY
// First and probably the easies is to create an array called: validationDataTypesArray
// Then add a member to this array using this format:
// validationDataTypesArray[dataTypeName]={"function":functionName,"message":Message if fails validation};
//
// EXAMPLE:  
// var validationDataTypesArray=new Array();
// validationDataTypesArray["mustBeKim"]={"function":mustBeKimFunct,"message":"This field must be set to 'Kim'"};

// Note you can add as may entries as needed.  Message is optional.

// ADD VIA THE addDataType METHOD (Not recommended)
// The second way to add a datatype is to use the addDataType method.
//  The addDataType method takes 3 parameters, dataType name, dataType function, and message
//  addDataType(dataType,dataTypeFunction,message)
//
// EXAMPLE
// validate.addDataType("mustBeKim",mustBeKimFunct,"This field must be set to 'Kim'");


// After using either method described above, the following form element will be validated correctly:
// <input name="text2" type="text" required="required" dataType="mustBeKim" />
//
// NOTE: Any custom dataTypes will override any build-in dataType.
//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// ADDING DATA TYPES INTO TO THE OBJECT ITSELF///////////////////////////////
// NOTE this normally isn't recommended  unless they are to be a permanent part of the object. The 
// method described should be used instead.
//
//  First add an entry in the setInternalValidationTypes method.
//
//  Secondly create a new method.  The method can only have one parameter - a pointer to the form element and
//                                  it must return a boolean.  True if the element passes, and false if it fails.
//									See the umIDNum method for a simple example
//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// OPTIONAL ADDITIONAL FUNCTIONS /////////////////////////////////////
//The following functions can be created and used with this library
//
//			formValidationRequiredElementInit - Function called when a page loads or a new required element is added to the form
// 			formValidationRemoveRequiredElement - Function called when a user no longer needs an element to be required (aka the method was called)
//
//         fieldValidationPass(formElementPointer,message,dataType,name,result) - Function called when a field passes validation
//
//         fieldValidationFail(formElementPointer,message,dataType,name,result) - Function called when a field fails validation
//
//         formValidationFail(formPointer,failedFieldArray) - Function called when a form fails validation (usually onsubmit)
//															   The failedField Array contains an array of failed form element informat of:
//																failedFieldNames[name]={
//																	"element":elementPointer,
//																	"message":message,
//																	"dataType":dataType,
//																	"name":name};
//			formValidationPass(formPointer) - Function called if a form passes validation.  Note this function must return true and will be run before the form is submitted.
//
//		formValidationOverRide(formPointer) - If this exists and it returns true, this function will over-ride the form validation method.  If it returns
//												false, the formValidation will be called.
//												Nice for allowing users to save a form without validation.  
//
// Note: these functions are not required for this library to function correctly
//////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////USING THIS LIBRARY WITH AJAX AND DOM SCRIPTING////////////////////////
//  If you add a new form tag via DOM , you need to call the setEntireForm method.
// Note that all required form elements will have listeners added (aka you do not
// need to call the setFormElement method for elements inside this form)
//
// Example:
// $('#myFormID').setEntireForm();
//
// If you add a new form element via DOM, and want that element to be validated (aka required) you need
// to call the addValidation method. This will automatically add the required class and any field listeners.
//
// Example:
// $("#myFormElementId").addValidation();
//

// If you need to validate the entire form without sumitting the form, call the validateForm method.  

//Example:
// $('#myFormId').validateForm()  // Note - this will not return a boolean - it returns a pointer to the form object.

// If you need to validate the entire form without submitting the form and need to know the result of the valiation, 
// call the validateFormBoolean method.  

//Example:
// $('#myFormId').validateFormBoolean()  // NOTE - This returns a boolean, so it must be at the end of a jQuery daisychain


// If you need to check the validation of a single form element, call the checkValidation method

//Example:
// $('#myFormElementId').checkValidation()  // Note - this will not return a boolean - it returns a pointer to the form element object.

//If you need to check the validation of a single form element and need to know the result of the validation, call the checkValidationBoolean method

//Example:
// $('#myFormElementId').checkValidationBoolean()  // Note - this will not return a boolean - it returns a pointer to the form element object.

//////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// START ON PAGE LOAD////////////////////////////////////////////////

var validate =new FormValidation(true);  // NOTE: if you need to change this variable, you also need to change it in the jQuery methods below.
$(document).ready(function(){validate.init()});



///////////////////////////// JQUERY METHODS //////////////////////////////////////////////////

$.fn.setEntireForm = function() {
	$(this).each(function(){validate.setEntireForm(this);});
    return this;
};

$.fn.setFormElement = function() { // note - normally this isn't called - use the addValidation method instead
	$(this).each(function(){validate.setFormElement(this);});
    return this;
};

$.fn.addValidation = function() {
	$(this).each(function(){validate.addValidation(this);});
    return this;
};

$.fn.checkValidation = function() {
	$(this).each(function(){validate.checkValidation(this);});
    return this;
};

$.fn.checkValidationBoolean=function(){
	var result=false;
	$(this).each(function(){ result=validate.checkValidation(this);});
    return result;
};


$.fn.validateForm = function(callExternalFunct) {
	$(this).each(function(){validate.validateForm(this,callExternalFunct);});
    return this;
};

$.fn.validateFormBoolean = function(callExternalFunct) {
	var validationResult=false;
	$(this).each(function(){validationResult=validate.validateForm(this);});
	return validationResult;
};

$.fn.removeValidation = function() { // This is to remove the validation for a single form element.
	$(this).each(function(){validate.removeValidation(this);});
    return this;
};




//////////////////////////////////////////////////////////////////////////////////////////////////


function FormValidation(formPointer,validateOnLoad){


	var textBoxEvent="blur";
	var checkBoxEvent="click";
	var radioBoxEvent="click";
	var selectBoxEvent="change";
	var textAreaEvent="blur";
	
	var requiredClass="required";
	var formatClass='format';
	var validateEventAttribute="validateEvent";
	var dataTypeAttribute="dataType";
	var dataTypeClassStarter="dataType_";
	
	var defaultDataType="nonEmpty";
	
	if(validateOnLoad==undefined||validateOnLoad=="")validateOnLoad=true;
	if(typeof formPointer=="boolean"){
			//user only entered a validateOnLoad
			validateOnLoad=formPointer;
			formPointer=""; //insure all forms get validation listeners
	}
	
	////////////////////////////////////// MAKE VALIDATION TYPES AVAILABLE ////////////////////////////////////////////
	var validationTypes=new Array();
	
   /**
	* Adds the interal dataTypes to the validationTypes array so the corresponding functions will be available during validation.
	* NOTE: a entry to the validationTypes array must be made here otherwise interal dataType functions will be ignored.
	* @member FormValidation
	* @private
	* @returns nothing
	*/
	setInternalValidationTypes=function(){
		validationTypes["nonEmpty"]={"function":nonEmpty,"message":"This field is required"};
		validationTypes["umIDNum"]={"function":UMIDNum,"message":"Please enter a valid UofM ID number"};
		validationTypes["date4Year"]={"function":date4Year,"message":"Please enter a valid date (mm/dd/yyyy)"};
		validationTypes["phone"]={"function":phone,"message":"Please enter a valid phone number (xxx-xxx-xxxx)"};
		validationTypes['numerical']={"function":numerical,"message":"Please enter a number"};
		validationTypes['email']={"function":email,"message":"Please enter an email address"};
		validationTypes['currency']={"function":currency,"message":"Please enter a dollar amount"};
		validationTypes["gpa"]={"function":checkGPA,"message":"The gpa must between 0.00 and 4.00"};
		validationTypes['fourDigitYear']={"function":fourDigitYear,"message":"Please enter a valid 4 digit year"};
	};
	
	
	////////////////////////////////////////VALIDATION OF FIELD TYPES//////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to nonEmpty.  Also validates a required field that is missing the "dataType" attribute.
	* In order to pass, the field must have a non-empty value.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/

	
	nonEmpty=function(formElement){
		var tagname=formElement.tagName;
		var $element=$(formElement);

		if($element.is(":checkbox")){
			if($element.is(":checked"))return true;;
		}
		
		else if($element.is(":radio")){
			if($('input[name='+$element.attr('name')+']:checked').length>0) return true;
		}
		else{
			
			var pattern=/\S+/i;
			return pattern.test($element.val());
		}
		return false;
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'numerical'.
	* In order to pass, the field value must only contain numbers.
	* If the field has an attribute of "numLength", this function will also validate to see that the field value is exactly that length.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	numerical=function(formElement,length){
		var $element=$(formElement);
		var fieldLength=$element.val().length;
		if($element.attr('numLength')){
			//!!!!!! Need to validate that the attribute is actually an int
			
			fieldLength=$element.attr('numLength');
		}
		else if(length!=undefined){
			fieldLength=length;
		}
		else if(fieldLength==0){
			//nothing was entered
			return false;	
		}
		var pattern=new RegExp("^\\d{"+fieldLength+"}$","i");
		return pattern.test($element.val());
		
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'umIDNum'.
	* In order to pass, the field value must be 7 numerical charicters.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	UMIDNum=function(formElementPointer){
		var pattern=/^\d{7}$/i;
		return pattern.test($(formElementPointer).val());
		
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'date4Year'.
	* In order to pass, the field value must be in the format of mm/dd/yyyy.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	date4Year=function(formElementPointer){
		var pattern=/^(\d{2})\/\d{2}\/\d{4}$/i;
		result= pattern.test($(formElementPointer).val());
		if(result){
			//check to see if month us between 1 and 12
			var month=pattern.exec($(formElementPointer).val())[1];
			if(month>0&&month<13) return true;
			else return false
		}
		else return false;
		
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'phone'.
	* In order to pass, the field value must be in the format of 123-456-7890 with the dashes being optional.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	phone=function(formElementPointer){
		var pattern=/^\d{3}-?\d{3}-?\d{4}$/i;
		return pattern.test($(formElementPointer).val());
		
	};
		/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'email'.
	* In order to pass, the field value must be in the format of a typical email.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	email=function(formElementPointer){
		var pattern=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // note this pattern is from: http://www.quirksmode.org/js/mailcheck.html
		return pattern.test($(formElementPointer).val());
		
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'email'.
	* In order to pass, the field value must be in the format of a typical email.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @returns boolean
	*/
	
	currency=function(formElementPointer){
		// note this pattern is modified version from:http://lawrence.ecorp.net/inet/samples/regexp-validate2.php
		var pattern=/^\$?[1-9][0-9]{0,2}(,?[0-9]{3})*(\.[0-9]{2})?$/; 
		return pattern.test($(formElementPointer).val());
		
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'gpa'.
	* In order to pass, the field value must be less than 4 and larger than 0.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @return
	*/
	checkGPA=function(field){
		var val=$(field).val();
		if(parseFloat(val)>4||parseFloat(val)<0) return false;
		else return true;
		
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a required field that has the "dataType" attribute set to 'fourDigitYear'.
	* In order to pass, the field value must be larger than 1900 and less than 2100.
	* @member FormValidation
	* @author Kim Doberstein
	* @private
	* @return
	*/
	fourDigitYear=function(field){
		//either empty or a valid four digit year.
		var val=$(field).val();
		if((parseFloat(val)>1900&&parseFloat(val)<2100)) return true;
		else return false;
		
	}
	
	
	
	
	
	
	
	
	
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Called when a FormValidation object is created.  
	* Adds onSubmit event to form tag and form elements by calling setEntireForm method
	* Calls setInternalValidationTypes method.
	* Grabs all external dataTypes set in the validationDataTypesArray by calling tthe grabExtraValidationTypes method.
	* @constructor
	* @member FormValidation
	* @private
	* @returns nothing
	*/
	init=function(){
		
		
		setInternalValidationTypes();
		grabExtraValidationTypes();
		
		if(formPointer!=undefined&&formPointer!=""){
			setEntireForm(formPointer);
			
		}
		else{
			// No form pointer entered - set all forms on the page
			$('form').each(function(){setEntireForm(this);});
		}
		
	};
	this.init=function(){init()};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Grabs all external dataTypes set in the validationDataTypesArray and adds them to the interal validationTypes array
	* so they will be available when a form element is validated.
	* Calls debugStatement
	* @member FormValidation
	* @private
	* @returns nothing
	*/
	grabExtraValidationTypes=function(){
		if(typeof validationDataTypesArray!="undefined"){
			
			for(var dataType in validationDataTypesArray){
				validationTypes[dataType]={};
				if(typeof validationDataTypesArray[dataType]=="object"){
					if(validationDataTypesArray[dataType]['function']){
						validationTypes[dataType]['function']=validationDataTypesArray[dataType]['function'];
						if(validationDataTypesArray[dataType]['message']) validationTypes[dataType]['message']=validationDataTypesArray[dataType]['message'];
						else validationTypes[dataType]['message']="";	
					}
					
					
					else debugStatement("ValidationDataTypesArray is not in the correct format for this data type: "+dataTypes);
					
				}
				else if(typeof validationDataTypesArray[dataType]=="function"){
					validationTypes[dataType]['function']=validationDataTypesArray[dataType];
					validationTypes[dataType]['message']="";
					
				}
				else debugStatement("Unable to add this data type to the validationTypes array: "+dataTypes);
				
			}
		}

		
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Adds event listeners to the form and the required form elements inside the form.  The validateForm method is called when the user submits the form.
	* Calls debugStatement
	* Calls setFormElement
	* @param {DOM pointer} formPointer Pointer to the form
	* @member FormValidation
	* @returns nothing
	*/
	
	setEntireForm=function(formPointer){
		if(formPointer==undefined||!formPointer){debugStatement("No such form sent to setEntireForm method. Setting up form validation failed"); return;}
		$(formPointer).bind("submit", function(event){return validateForm(formPointer);});
		$(formPointer).find("*:input").each(function(){setFormElement(this);});
	};
	
	this.setEntireForm=function(formPointer){setEntireForm(formPointer);}
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Adds an event listener to the form element.  The checkValidation method will be called when a user interacts with the form element.
	* Calls addListener
	* @param {DOM pointer} formElementPointer Pointer to the form elment
	* @member FormValidation
	* @returns nothing
	*/
	
	setFormElement=function(formElement){
		var $element=$(formElement);
		if($element.hasClass(requiredClass)||$element.hasClass(formatClass)){
		
			var tag="";
			$element.each(function(){tag=this.tagName});	
				
			//attach validation item
			var listenerEvent=""; 
			if($element.attr(validateEventAttribute)){
					listenerEvent=$element.attr(validateEventAttribute);
			}
			else {
				if($element.is(":text")){listenerEvent=textBoxEvent;}
				else if($element.is(":checkbox")){listenerEvent=checkBoxEvent;}
				else if($element.is(":radio")){listenerEvent=radioBoxEvent;}
				else if(tag=="SELECT"||tag=="select"){listenerEvent=selectBoxEvent;}
				else if(tag=="TEXTAREA"||tag=="textarea"){listenerEvent=textAreaEvent;}
				else listenerEvent="blur"; // just in case 
			}
			
			$element.bind(listenerEvent,function(){checkValidation(this)});
			if(typeof formValidationRequiredElementInit!="undefined")formValidationRequiredElementInit(formElement);
			if(validateOnLoad)checkValidation(formElement);
		}
	};
	this.setFormElement=function(formElement){setFormElement(formElement)};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Validates a form element with the corresponding dataType function.  
	* Calls debugStatement
	* Calls validationResult
	* @param {DOM pointer} formElementPointer Pointer to the item that is to be validated
	* @member FormValidation
	* @returns Boolean
	*/
	checkValidation=function(formElement){

		if($(formElement).hasClass(requiredClass)||$(formElement).hasClass(formatClass)&&isVisible(formElement)){

			
			//var dataType=defaultDataType; //Generic
			
			
			var dataTypes=extractDataFromClassName($(formElement).attr('class'),dataTypeClassStarter);
		
			
			if(dataTypes==""||dataTypes==undefined)dataTypes[0]=defaultDataType; 
				
	
			var result=true;
	
			var message= new Array();
			
			
			for(var i=0;i<dataTypes.length;i++){
				
				if(validationTypes[dataTypes[i]]){
					var thisDataTypeResult=validationTypes[dataTypes[i]]["function"](formElement);
					if(result)result=thisDataTypeResult;
					if(!thisDataTypeResult)message.push(validationTypes[dataTypes[i]]["message"]);
				}
				
				else debugStatement("Unknown dataType in checkValidation method: "+dataType);
				
				
			}
			
			
			if(result&& typeof fieldValidationPass!="undefined")fieldValidationPass(formElement,message,dataTypes,result);
			else if(!result&&typeof fieldValidationFail!="undefined")fieldValidationFail(formElement,message,dataTypes,result);
			
			return result;
		}//if requried and is visible
		
		return true; //There wasn't a required class or is not visible
		
	};
	this.checkValidation=function(formElement){return checkValidation(formElement)};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Valides all the required elements in a given form.  If at least on the elements fails validation, this method
	* returns false and the external function, formValidationFail is called.
	*  The external function, formValidationOverRide(formPointer), is called if it exists, the method just 
	* returns the  result of this function.
	* The following parameters are sent to the external function formValidationFail:(formPointer,failedFieldNames);
	* Where failedFiledNames is an array containing information about the failed fields in this format:
	* failedFieldNames[name]={"element":pointer,"message":message,"dataType":dataType,"name":fname};
	* Calls formValidationOverRide
	* Calls checkValidation
	* Calls formValidationFail
	* @param {DOM pointer} formPointer Pointer to the form to be validated
	* @param {Boolean} callExternalFunct Should the external funciton,  formValidationFail be called.  Defaults to true.
	* @member FormValidation
	* @returns Boolean
	*/
	
	validateForm=function(formPointer,callExternalFunct){
		if(callExternalFunct==undefined||typeof callExternalFunct!="boolean")callExternalFunct=true;
		
		if(typeof formValidationOverRide!="undefined"&&formValidationOverRide(formPointer)) return formValidationOverRide(formPointer);
		if(typeof formPreValidationCheck!="undefined" &&!formPreValidationCheck(formPointer)) return false; // added for EA - if returns false - stop validation and stop submit
		var failedFieldNames=new Array();
		var isFormValid=true;
		
		
		$(formPointer).find("*:input").each(function(){
			if(($(this).hasClass(requiredClass)||$(this).hasClass(formatClass))&&!checkValidation(this)){
				isFormValid=false;
				var dataType=defaultDataType;
				if($(this).attr('dataType'))dataType=$(this).attr('dataType');
				
				failedFieldNames[$(this).attr('name')]={"element":$(this),"message":validationTypes[dataType]["message"],"dataType":dataType,"name":$(this).attr('name')};
			}
													 
		});
		
		
		if(!isFormValid){
			if(typeof formValidationFail!="undefined"&&callExternalFunct)formValidationFail(formPointer,failedFieldNames);
		}
		else if(typeof formValidationPass!="undefined"&&callExternalFunct&&formValidationPass(formPointer))return isFormValid;
			

		return isFormValid;
		
	};
	
	this.validateForm=function(formPointer,callExternalFunct){validateForm(formPointer,callExternalFunct)};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Adds validation to a form element.  This method will automatically add the correct attributes and listeners to the element tag.
	* Calls setFormElement method.
	* @member FormValidation
	* @param {DOM pointer} formElementPointer  
	* @param {String} dataType  Optional - Data type of form element.
	* @returns nothing
	*/
	this.addValidation=function(formElement,dataType){
		$(formElement).addClass(requiredClass);
		//if(dataType!=undefined)$(formElement).attr(dataTypeAttribute,dataType);
			if(dataType!=""&&dataType!=undefined)$(formElement).addClass(dataTypeClassStarter+""+dataType);
		setFormElement(formElement);
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Removes validation to a form element.  This element will no longer be validated
	* @member FormValidation
	* @param {DOM pointer} formElementPointer  
	* @returns nothing
	*/
	this.removeValidation=function(formElement){
		$(formElement).removeClass(requiredClass);
		// there may be the need to remove the event
		if(typeof formValidationRemoveRequiredElement!="undefined")formValidationRemoveRequiredElement(formElement);
		
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Checks to see if the correct event passed is a valid event listener type.
	* Calls debugStatment method.
	* @param {String} newEvent  Event type
	* @member FormValidation
	* @private
	* @returns boolean
	*/
	checkEventTypes=function(newEvent){
		var eventListeners=new Array("blur","change","click","focus","mousedown","mousemove","mouseout","mouseover","mouseup","select");
		var eventMatch=false;
		for(var i=0;i<eventListeners.length&&!eventMatch;i++){	
			if(eventListeners==eventMatch[i]) eventMatch=true;
		}
		if(!eventMatch)debugStatement("Improper event type passed to checkEventTypes method: "+newEvent);
		return eventMatch;
		
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* Checks to see if element is visible to the end user
	* @param parent - object to be tested
	* @member FormValidation
	* @private
	* @returns boolean
	*/
	isVisible=function(parent){
		// From http://www.webmasterworld.com/forum91/1935.htm
		var body = document.body 
 		while(parent!= body){ 
		  if(parent.style.display == "none") 
		   return false 
		  parent = parent.parentNode 
		} 
		 return true 
		
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* This method is used for showing errors.  If the DeBug library (https://wiki.umn.edu/view/EADWebDesigner/DeBug) 
	* is available, the message will be shown in the debugging window.
	* If the DeBug library is not available, then a javascript alert is shown. 
	* @param {String} message Message to be displayed in the debugging method.
	* @private
	* @member FormValidation
	* @returns nothing
	*/
	debugStatement=function(message){
		if(typeof debug!="undefined") debug(message);
		else alert("Error: "+message);
	};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	* This method determines if any class starts with a given string.
	* @param {String} classNames Class names.  Usually a dump from $(element).attr('class')
	* @param {String} classStarter What the class should start with.  This is stripped out when result is returned.
	* @private
	* @member FormValidation
	* @returns Th e rest of the class name starting with class header or "" if there wasn't a match.
	*/
	
	extractDataFromClassName=function(classNames, classStarter){
			var classes = classNames.split(' '); // Spit classNamge into separate classes - so each can be evaluated
			var returnArray=new Array();
			
			for(var i in classes){
				if(classes[i].match(classStarter)) returnArray.push(classes[i].replace(classStarter,'')); // There is a match
				
			}
	
			return returnArray;
		};
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
}// end object
