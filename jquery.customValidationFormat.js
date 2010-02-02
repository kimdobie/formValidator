
var validationDataTypesArray=new Array();
validationDataTypesArray["prevAbroad"]={"function":prevAbroad,"message":"All four fields in this row are required"};
validationDataTypesArray["prevAbroadYear"]={"function":fourDigitYear,"message":"All four fields in this row are required"};
validationDataTypesArray["selectProgram"]={"function":prevAbroad,"message":"Select a program below"};


function prevAbroad(formElement){
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
}
function fourDigitYear(field){
	//either empty or a valid four digit year.
		var val=$(field).val();
		if(val==""||(parseFloat(val)>1900&&parseFloat(val)<2100)) return true;
		else return false;
	
}


var labelClass='requiredText';
var messageClass='requiredText';


var validationDataTypesArray=new Array();




function fieldValidationFail(formElement,message,dataType,result){
	//Function called when a field fails validation
	//If this is a text input or a text area - make the background yellow
	// Add message to last td

	var $messageTD=$(formElement).parent().next();
	if ($(formElement).attr('customMessage')){
		var messageID=$(formElement).attr('customMessage');
		$messageTD=$('#'+messageID);
	}
	$messageTD.html("<span class='"+messageClass+"'>* "+message+" *");
	
}

function fieldValidationPass(formElement,message,dataType,result){
	//Function called when a field passes validation
	// Remove yellow background
	// Remove message in last td
	var $messageTD=$(formElement).parent().next();
	if ($(formElement).attr('customMessage')){
		var messageID=$(formElement).attr('customMessage');
		$messageTD=$('#'+messageID);
	}
	else if($(formElement).attr('customLabel')){
		var messageID=$(formElement).attr('customLabel')+"Message";
		$messageTD=$('#'+messageID);
	}

	////////////////////// THIS IS A HACK TO GET THE REQUIRED PREVIOUS STUDY ABROAD EXPERIENCES FIELDS TO WORK //////////////////
	var othersInRowEmpty=false;
	if($(formElement).parents('table').eq(0).attr('id')=='hasTraveledTable'){
		$(formElement).parents('tr').eq(0).find('*:input').each(function(){
			if($(this).val()=="")othersInRowEmpty=true;																 
																		 
		});
		
	}
	if(othersInRowEmpty)return;
	
	
	
	
	
	$messageTD.html("");
	
}

function formValidationFail(formPointer,failedFieldArray){
	
	//Function called when a form fails validation  onsubmit
	// alert box with messages

	var message="The form is not complete, please fill out all required fields before submitting:"
	for(element in failedFieldArray){
	
		// get field label
		var labelText=$(failedFieldArray[element]["element"]).parent().prev().text();
		
		if( $(failedFieldArray[element]["element"]).attr('customLabel')){
			var customLabelID=$(failedFieldArray[element]["element"]).attr('customLabel');
			labelText=$('#'+customLabelID).text();
		}
		
		
		message+="\n\n     "+labelText+"  "+failedFieldArray[element]["message"];

	}
	alert(message);
}

function formValidationPass(formPointer){
	//Function called when a form passes validation just before the form is submitted

	
	if($('#enterProgramContainer:visible').length>0){
		// The user has entered their program information
		alert("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean eget felis vel dolor luctus aliquet. Nunc feugiat egestas quam. Sed turpis metus, commodo id, dictum vel, dapibus sit amet, est. Praesent euismod magna id nisi. Mauris et mi.");
		
	}
	
}




function formValidationRequiredElementInit(formElement){
	//Function called when a page loads or a new required element is added to the form
	// Add "*" before field label
	
	
	var $labelTD=$(formElement).parent().prev();
	if($(formElement).attr('customLabel')){
		var labelID=$(formElement).attr('customLabel');
		$labelTD=$('#'+labelID);
	}
	
	else if($labelTD.find('label').length>0)$labelTD=$labelTD.find('label').eq(0);
	
	
	
	if(!$labelTD.find(":first-child").hasClass(labelClass))$labelTD.prepend("<span class='"+labelClass+"'>* </span>");
	

}

