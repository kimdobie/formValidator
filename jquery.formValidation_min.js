// Version 2.0.1
var validate=new FormValidation(true);$(document).ready(function(){validate.init()});$.fn.setFormValidation=function(){$(this).each(function(){validate.setEntireForm(this)});return this};$.fn.addValidation=function(){$(this).each(function(){validate.addValidation(this)});return this};$.fn.removeValidation=function(){$(this).each(function(){validate.removeValidation(this)});return this};$.fn.checkValidation=function(){var g=false;$(this).each(function(){g=validate.checkValidation(this)});return g};
$.fn.validateForm=function(g){var h=false;$(this).each(function(){h=validate.validateForm(this,g)});return h};
function FormValidation(g,h){if(h==undefined||h=="")h=true;if(typeof g=="boolean"){h=g;g=""}var e=[];setInternalValidationTypes=function(){e.nonEmpty={"function":nonEmpty};e.umIDNum={"function":UMIDNum};e.date4Year={"function":date4Year};e.phone={"function":phone};e.numerical={"function":numerical};e.email={"function":email};e.currency={"function":currency};e.gpa={"function":checkGPA};e.fourDigitYear={"function":fourDigitYear};e.minLength={"function":minLength};e.maxLength={"function":maxLength}};
nonEmpty=function(a){a=$(a);if(a.is(":checkbox")){if(a.is(":checked"))return{result:true,message:"This field is required"}}else if(a.is(":radio")){if($("input[name="+a.attr("name")+"]:checked").length>0)return{result:true,message:"This field is required"}}else return{result:/\S+/i.test(a.val()),message:"This field is required"};return{result:false,message:"This field is required"}};numerical=function(a,b){a=$(a);var c=a.val().length;if(a.attr("numLength"))c=a.attr("numLength");else if(b!=undefined)c=
b;else if(c==0)return{result:false,message:"Please enter a number"};return{result:(new RegExp("^\\d{"+c+"}$","i")).test(a.val()),message:"Please enter a number"}};UMIDNum=function(a){return{result:/^\d{7}$/i.test($(a).val()),message:UMIDNumMessage}};date4Year=function(a){var b=/^(\d{2})\/\d{2}\/\d{4}$/i;if(result=b.test($(a).val())){a=b.exec($(a).val())[1];return a>0&&a<13?{result:true,message:"Please enter a valid date (mm/dd/yyyy)"}:{result:false,message:"Please enter a valid date (mm/dd/yyyy)"}}else return{result:false,
message:"Please enter a valid date (mm/dd/yyyy)"}};phone=function(a){return{result:/^\d{3}-?\d{3}-?\d{4}$/i.test($(a).val()),message:"Please enter a valid phone number (xxx-xxx-xxxx)"}};email=function(a){return{result:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($(a).val()),message:"Please enter an email address"}};currency=function(a){return{result:/^\$?[1-9][0-9]{0,2}(,?[0-9]{3})*(\.[0-9]{2})?$/.test($(a).val()),message:"Please enter a dollar amount"}};checkGPA=function(a){a=
$(a).val();return parseFloat(a)>4||parseFloat(a)<0?{result:false,message:checkGPAMessage}:{result:true,message:checkGPAMessage}};fourDigitYear=function(a){a=$(a).val();return parseFloat(a)>1900&&parseFloat(a)<2100?{result:true,message:"Please enter a valid 4 digit year"}:{result:false,message:"Please enter a valid 4 digit year"}};minLength=function(a){var b=parseInt(extractDataFromClassName($(a).attr("class"),"dataType_minLength_"));if($(a).val().length>=b)return{result:true,message:"Your response is too short"};
return{result:false,message:"Your response is too short"}};maxLength=function(a){var b=parseInt(extractDataFromClassName($(a).attr("class"),"dataType_maxLength_"));if($(a).val().length<=b)return{result:true,message:"Your response is too long"};return{result:false,message:"Your response is too long"}};init=function(){setInternalValidationTypes();grabExtraValidationTypes()};this.init=function(){init()};grabExtraValidationTypes=function(){if(typeof validationDataTypesArray!="undefined")for(var a in validationDataTypesArray){e[a]=
{};if(typeof validationDataTypesArray[a]=="object")if(validationDataTypesArray[a]["function"])e[a]["function"]=validationDataTypesArray[a]["function"];else debugStatement("ValidationDataTypesArray is not in the correct format for this data type: "+dataTypes);else if(typeof validationDataTypesArray[a]=="function")e[a]["function"]=validationDataTypesArray[a];else debugStatement("Unable to add this data type to the validationTypes array: "+dataTypes)}};setEntireForm=function(a){if(a==undefined||!a)debugStatement("No such form sent to setEntireForm method. Setting up form validation failed");
else{$(a).bind("submit",function(){return validateForm(a)});$(a).find("*:input").each(function(){setFormElement(this)})}};this.setEntireForm=function(a){setEntireForm(a)};setFormElement=function(a){var b=$(a);if(b.hasClass("required")||b.hasClass("format")){var c="";b.each(function(){c=this.tagName});var d=extractDataFromClassName($(a).attr("class"),"validateEvent_");d=d.length>0?d[0]:b.is(":text")?"blur":b.is(":checkbox")?"click":b.is(":radio")?"click":c=="SELECT"||c=="select"?"change":c=="TEXTAREA"||
c=="textarea"?"blur":"blur";b.bind(d,function(){checkValidation(this)});typeof formValidationRequiredElementInit!="undefined"&&b.hasClass("required")&&formValidationRequiredElementInit(a);h&&checkValidation(a)}};this.setFormElement=function(a){setFormElement(a)};checkValidation=function(a,b){if($(a).hasClass("required")||$(a).hasClass("format")&&isVisible(a)){var c=extractDataFromClassName($(a).attr("class"),"dataType_",true);if(c==""||c==undefined)c[0]="nonEmpty";var d=true,f=[],i=[];if($(a).hasClass("required")||
$(a).hasClass("format")&&$(a).val()!="")for(var j=0;j<c.length;j++)if(e[c[j]]){var k=e[c[j]]["function"](a).result;if(d)d=k;if(!k){f.push(e[c[j]]["function"](a).message);i.push(c[j])}}else debugStatement("Unknown dataType in checkValidation method: "+c[j]);if(d&&typeof fieldValidationPass!="undefined")fieldValidationPass(a,f,c,d);else!d&&typeof fieldValidationFail!="undefined"&&fieldValidationFail(a,f,i,d);if(!d&&b!=undefined&&b==true)return{result:d,messages:f,dataTypes:i};return d}return true};
this.checkValidation=function(a){return checkValidation(a)};validateForm=function(a,b){if(b==undefined||typeof b!="boolean")b=true;if(typeof formValidationOverRide!="undefined"&&formValidationOverRide(a))return formValidationOverRide(a);if(typeof formPreValidationCheck!="undefined"&&!formPreValidationCheck(a))return false;var c=[],d=true;$(a).find("*:input").each(function(){var f=checkValidation(this,true);if(($(this).hasClass("required")||$(this).hasClass("format"))&&typeof f!="boolean"){d=false;
if(f.dataTypes==""||f.dataTypes==undefined)f.dataTypes[0]="nonEmpty";c[$(this).attr("name")]={element:$(this),messages:f.messages,dataTypes:f.dataTypes,name:$(this).attr("name")}}});if(d)typeof formValidationPass!="undefined"&&b&&formValidationPass(a);else typeof formValidationFail!="undefined"&&b&&formValidationFail(a,c);return d};this.validateForm=function(a,b){return validateForm(a,b)};this.addValidation=function(a,b){$(a).addClass("required");b!=""&&b!=undefined&&$(a).addClass("dataType_"+b);
setFormElement(a)};this.removeValidation=function(a){$(a).removeClass("required");typeof formValidationRemoveRequiredElement!="undefined"&&formValidationRemoveRequiredElement(a)};checkEventTypes=function(a){for(var b=new Array("blur","change","click","focus","mousedown","mousemove","mouseout","mouseover","mouseup","select"),c=false,d=0;d<b.length&&!c;d++)if(b==c[d])c=true;c||debugStatement("Improper event type passed to checkEventTypes method: "+a);return c};isVisible=function(a){for(var b=document.body;a!=
b;){if(a.style.display=="none")return false;a=a.parentNode}return true};debugStatement=function(a){typeof debug!="undefined"?debug(a):alert("Error: "+a)};extractDataFromClassName=function(a,b,c){a=a.split(" ");var d=[];for(var f in a)if(a[f].match(b)){var i=a[f].replace(b,"");if(c)i=/^[^_]+/i.exec(i);d.push(i)}return d}};