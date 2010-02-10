
// NOTES:
//These functions are called from the jquery.formValidator.js file.  

//These functions determine what should happen visually when a form element passes/fails validation and when a form fails validation.


//The contents of the functions should be modified to fit your own needs.


var labelClass='requiredText'; //Class added to the "required" "marker" in the label
var messageClass='requiredText'; //Class added to the "please enter" error message next to the form element

var failedLabelClass="requiredTextBold"; //Class applied to the label of a failed form element after user tries to submit the form
var failedMessageClass="requiredTextBold"; // Class applied to the message of a failed form element after a user tries to submit the form


var customLabelClassStarter="customLabel_"; // Start of class applied to the form element marking a custom label.  This class should end in the ID of the label container.
var customMessageClassStarter="customMessage_"; //Start of the class applied to the form element marking a custom message.  This class should end in the ID of the message container

var formElementParentTag=""; // put the container tag here if not in a table//


var messageContainerClass="messageContainer"; //class applied to message container
var messageContainerTag="span"; // tag that holds the message text

var formValidationErrorsId="formValidationErrors"; //ID of div that will hold the errors from a form validation (not required)




////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is called by numerous functions below.  From the form element, it returns
//the pointer to the label object.


function getLabelObj(formElement){
	
	// All else fails - get the label tag associated with the element
	var $label=$("label[for='"+$(formElement).attr('id')+"']");
	
	
	// Because visually, the label tag for a radio button is not what people consider as the "label"
	if($(formElement).attr('type')=="radio"||$label.length==0){
		// Assume the first table cell in this row is the label
		$label=$(formElement).parents('tr:first').children('td:first');
		
		
		//If the radios are not in a table, get the legend for the corresponding fieldset
		if($label.length==0) $label=$(formElement).parents('fieldset:first').children('legend:first');
		
	}
	
	
	//Check to see if there is a custom label defined for this form element
	var customLabel=extractFromClassNameHelper($(formElement).attr('class'), customLabelClassStarter);
	if(customLabel!=""&&customLabel!=undefined) $label=$('#'+customLabel);
	
	
	return $label;
	
}



////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is called by numerous functions below.  From the form element, it returns
//the pointer to the container the message will be applied.


function getMessageObj(formElement){
	
	//first assume it is the last table cell in the form element's table row
	var $message=$(formElement).parents('tr:first').children('td:last');
	
	
	// if not in a row - find the parent tag and look for a special message container tag 
	if($message.length==0) $message=$(formElement).parents(formElementParentTag+':first').find('.'+messageContainerClass+':first');
	
	
	//Check to see if there is a custom label defined for this form element
	var customMessage=extractFromClassNameHelper($(formElement).attr('class'), customMessageClassStarter);
	if(customMessage!=""&&customMessage!=undefined) $message=$('#'+customMessage);
	
	
	
	return $message;
	
	
	
}





////////////////////////////////////////////////////////////////////////////////////////////////////
// This function is called when the page is loaded OR if validation is added to a form element.
// By default it adds a "*" before the label.

function formValidationRequiredElementInit(formElement){

	

	//Find the label 
	var $label=getLabelObj(formElement);
	//Add a "*"
	if($label.find('span.'+labelClass).length==0) $label.prepend("<span class='"+labelClass+"'>* </span>");
	
	
	// if not in a table, set up a span that will hold the message.  This is used by the getMessageObj function	
	if($(formElement).parents('tr:first').length==0){
		$(formElement).parents(formElementParentTag+':first').append('<'+messageContainerTag+' class="'+messageContainerClass+'"></'+messageContainerTag+'>');	
	}
									  
	
	

}





////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is called when a single field fails validation.
//formElement: pointer to the form element
//messages: array of error messages
//dataTypes: array of faild dataTypes
//result: should always be false (used for testing)

//This function displays the error message next to the field


function fieldValidationFail(formElement,messages,dataTypes,result){
	
	// get message object
	var $message=getMessageObj(formElement);
	
	//build the text of the actual message
	var messageText="* ";
	for(var i=0;i<messages.length;i++){
		messageText+=messages[i]+" *";
		
	}
	
	//If it isn't already showing, display the message
	if($message.find('span.'+messageClass).length==0||$message.find('span.'+messageClass).text()!=messageText){
		$message.html("<span class='"+messageClass+"' style='display:none'>"+messageText+"");
		$message.find('span.'+messageClass).fadeIn('slow');
	}
	
	
	
}




////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is called when a single field passes validation.
//formElement: pointer to the form element
//messages: array of error messages (normally not used)
//dataTypes: array of passed dataTypes
//result: should always be true (used for testing)

//This function removes the error message next to the field


function fieldValidationPass(formElement,messages,dataTypes,result){
	
	//Get message object
	var $message=getMessageObj(formElement);
	
	//Remove message
	$message.find('span.'+messageClass).fadeOut('slow',function(){$message.html("");});
	
	//Removes class that is applied to the label when a user trys to submit the form
	getLabelObj(formElement).removeClass(failedLabelClass);
	
	
}





////////////////////////////////////////////////////////////////////////////////////////////////////
//This function is called when the user tries to submit the form and validation has failed on at least one form element
//formPointer: pointer to the form 
//failedFieldArray: array of failed fields and messages
//		Informat of: /failedFieldArray['form name attribute']={"result":result,"messages":message[],"dataTypes":dataTypes[]};


//This function does one of two things:
// if there is a div with the "formValidationErrors" (set above) id, then the errors will appear there;
// otherwise the errors show up in a javascript alert menu.


function formValidationFail(formPointer,failedFieldArray){
	
	
	
	
	
		//Add a failedlabel and failedMessgeClass to every failed label and message in the form
		for(element in failedFieldArray){
		
			getLabelObj($(failedFieldArray[element]["element"])).addClass(failedLabelClass);
			getMessageObj($(failedFieldArray[element]["element"])).find('span.'+messageClass).addClass(failedMessageClass);
	
		}
	
	
	
	
	
	/// What to do if there is a div with formValidationErrors id
	if($('#'+formValidationErrorsId).length==1){
		
		$('#formValidationErrors').html("").css('display','none');// hide if already showing
		
		//Add a named anchor if it doesn't exit.  
		if($('#formValidationErrorsAnchor').length==0){$('#'+formValidationErrorsId).append('<a name="formValidationErrorsAnchor" id="formValidationErrorsAnchor"></a>');}
		
		
		//Start of message
		var message="<p><strong>The form is not complete, please fill out all required fields before submitting:</strong></p>";
		message +="<ul>";
		
		// Get the label and message for each element and add to message string
		for(element in failedFieldArray){
	
			var $label=getLabelObj($(failedFieldArray[element]["element"]));	
			
			for(var i=0; i< failedFieldArray[element]['messages'].length; i++){
				message+="<li>"+$label.text()+" - "+failedFieldArray[element]['messages'][i]+"</li>";		
			}
			
	
		}
		
		message+="</ul>"; //end message string
		
		
		//Put messages in the div and fade in
		$('#'+formValidationErrorsId).append(message).fadeIn('slow');
		
		//Moe to named anchor so user can see the errors
		window.location="#formValidationErrorsAnchor";
		return;
	}
	
	
	
	//There wasn't a div for errors to go - put errors in a javascript alert window
	var message="The form is not complete, please fill out all required fields before submitting:"
	for(element in failedFieldArray){
		
		var $label=getLabelObj($(failedFieldArray[element]["element"]));	
		
		for(var i=0; i< failedFieldArray[element]['messages'].length; i++){
				message+="\n\n     "+$label.text()+"  "+failedFieldArray[element]['messages'][i];
				
			}

	}
	alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//Function called when a form passes validation just before the form is submitted



function formValidationPass(formPointer){
	

	
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// This little helper function checks to see if the submitted classes start with the given classStarter. 


	function extractFromClassNameHelper(classNames, classStarter){
			var classes = classNames.split(' '); // Spit classNamge into separate classes - so each can be evaluated
			
			for(var i in classes){
				if(classes[i].match(classStarter)) return classes[i].replace(classStarter,''); // There is a match
			}
			return ''; //There wasn't a match
		};

////////////////////////////////////////////////////////////////////////////////////////////////////
