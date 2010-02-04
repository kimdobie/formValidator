



var labelClass='requiredText'; //Class added to the "required" marker in the label
var messageClass='requiredText'; //Class added to the "please enter" error message next to the form element

var failedLabelClass="requiredTextBold";
var failedMessageClass="requiredTextBold";


var customLabelClassStarter="customLabel_";
var customMessageClassStarter="customMessage_";


////////////////////////////////////////////////////////////////////////////////////////////////////
//Helper function to get a label associated with a form element
function getLabelObj(formElement){
	
	var $label=$("label[for='"+$(formElement).attr('id')+"']");
	
	
	
	if($(formElement).attr('type')=="radio"||$label.length==0){
		// This is a radio button - just assume the first table cell in this row is the label
		$label=$(formElement).parents('tr:first').children('td:first');
	}
	
	
	//Check to see if there is a custom label
	var customLabel=extractFromClassNameHelper($(formElement).attr('class'), customLabelClassStarter);
	if(customLabel!=""&&customLabel!=undefined) $label=$('#'+customLabel);
	
	
	
	return $label;
	
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//Helper function to get a label associated with a form element
function getMessageObj(formElement){
	
	var $message=$(formElement).parents('td:first').next();
	
	
	var customMessage=extractFromClassNameHelper($(formElement).attr('class'), customMessageClassStarter);
	if(customMessage!=""&&customMessage!=undefined) $message=$('#'+customMessage);
	
	
	
	return $message;
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function formValidationRequiredElementInit(formElement){
	//Function called when a page loads or a new required element is added to the form
	// Add "*" before field label
	

	//Find the label 
	var $label=getLabelObj(formElement);
	//Add a "*"
	if($label.find('span.'+labelClass).length==0) $label.prepend("<span class='"+labelClass+"'>* </span>");
									  
									 
	

}

////////////////////////////////////////////////////////////////////////////////////////////////////



function fieldValidationFail(formElement,messages,dataTypes,result){
	//Function called when a field fails validation
	// Add message to next td
	
	//Note, messages,dataTypes are arrays
	

	var $message=getMessageObj(formElement);
	var messageText="* ";
	for(var i=0;i<messages.length;i++){
		messageText+=messages[i]+" *";
		
	}
	//need to determine if this already exists - if not add it
	if($message.find('span.'+messageClass).length==0||$message.find('span.'+messageClass).text()!=messageText){
		$message.html("<span class='"+messageClass+"' style='display:none'>"+messageText+"");
		$message.find('span.'+messageClass).fadeIn('slow');
	}
	
	
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////

function fieldValidationPass(formElement,messages,dataTypes,result){
	//Function called when a field passes validation
	// Remove message in next td
	
	//Note, messages,dataTypes are arrays
	
	var $message=getMessageObj(formElement);
	$message.find('span.'+messageClass).fadeOut('slow',function(){$message.html("");});
	getLabelObj(formElement).removeClass(failedLabelClass);
	
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////

function formValidationFail(formPointer,failedFieldArray){
	
	//Function called when a form fails validation  onsubmit
	
	
	//Let's add the "misse
	
	
		for(element in failedFieldArray){
		
			getLabelObj($(failedFieldArray[element]["element"])).addClass(failedLabelClass);
			getMessageObj($(failedFieldArray[element]["element"])).find('span.'+messageClass).addClass(failedMessageClass);
	
		}
	
	
	
	
	
	
	//There is a div on the page where the errors  should go.	
	if($('#formValidationErrors').length==1){
		
		$('#formValidationErrors').html("").css('display','none');
		if($('#formValidationErrorsAnchor').length==0){$('#formValidationErrors').append('<a name="formValidationErrorsAnchor" id="formValidationErrorsAnchor"></a>');}
		
		var message="<p><strong>The form is not complete, please fill out all required fields before submitting:</strong></p>";
		message +="<ul>";
		
		for(element in failedFieldArray){
		
			var $label=getLabelObj($(failedFieldArray[element]["element"]));	
			message+="<li>"+$label.text()+" - "+failedFieldArray[element]["message"]+"</li>";
	
		}
		
		message+="</ul>";
		
		$('#formValidationErrors').append(message);
		
		$('#formValidationErrors').fadeIn('slow');
		
		return;
	}
	
	
	
	//There wasn't a div for errors to go - put errors in a javascript alert window

	var message="The form is not complete, please fill out all required fields before submitting:"
	for(element in failedFieldArray){
		
		var $label=getLabelObj($(failedFieldArray[element]["element"]));	
		message+="\n\n     "+$label.text()+"  "+failedFieldArray[element]["message"];

	}
	alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////



function formValidationPass(formPointer){
	//Function called when a form passes validation just before the form is submitted


	
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
