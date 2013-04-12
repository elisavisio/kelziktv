//STB operations
var OperationCodeRetrieveSTBStatus = "10";
var OperationCodePushVODInfoSheet = "07";
var OperationCodePlayVOD = "06";
var OperationCodeKeyEvent = "01";
var OperationCodeZap = "09";
//STB keycode
var KEYCODE_PGM_P = "402";
var KEYCODE_PGM_M = "403";
var KEYCODE_VOL_P = "115";
var KEYCODE_VOL_M = "114";
var KEYCODE_POWER = "116";
var KEYCODE_UP = "103";
var KEYCODE_DOWN = "108";
var KEYCODE_LEFT = "105";
var KEYCODE_RIGHT = "106";
var KEYCODE_OK = "352";
var KEYCODE_BACK = "158";
var KEYCODE_MENU = "139";
var KEYCODE_0 = "512";
var KEYCODE_1 = "513";
var KEYCODE_2 = "514";
var KEYCODE_3 = "515";
var KEYCODE_4 = "516";
var KEYCODE_5 = "517";
var KEYCODE_6 = "518";
var KEYCODE_7 = "519";
var KEYCODE_8 = "520";
var KEYCODE_9 = "521";
var KEYCODE_PLAYPAUSE = "164";
var KEYCODE_REWIND = "168";
var KEYCODE_FORWARD = "159";
var KEYCODE_REC = "167";
var KEYCODE_LEFTSHIFT = "042";
var KEYCODE_RIGHTALT = "100";
var KEYCODE_BACKSPACE = "014";
var KEYCODE_STOP = "166";
var KEYCODE_RED = "398";
var KEYCODE_GREEN = "399";
var KEYCODE_CancelOrC = "223";
//STB Keyevent mode
var KEYEVENT_MODE_PUSHRELEASEKEY = 0;
var KEYEVENT_MODE_PUSHKEY = 1;
var KEYEVENT_MODE_RELEASEKEY = 2;


var stbBaseUrl = false;

function detectSTB(){
	var ip = 7;
	while(ip <= 15){
		testSTBBaseIP(ip);		
		ip++;
	}
}

function stbCallFrame(){
	var Frame = $('#hiddenIframe');
	if(Frame.length == 0){
		Frame = $("<iframe id='hiddenIframe'></iframe>");
		Frame.hide();
		$('body').append(Frame);
	}
	return Frame;
}

function stbCall(url){
	if(stbBaseUrl){
		$.ajaxSetup ({
				// Disable caching of AJAX responses
				cache: false
		});

		stbCallFrame().attr('src', url); 
		var iframe = stbCallFrame().load(function(){
		      $('#debug').append("<div>STB Call: "+url+"</div>");
		 }); 
	}
}

function pressSTBKey(keycode,mode){
	mode = typeof mode !== 'undefined' ? mode : KEYEVENT_MODE_PUSHRELEASEKEY;
	if(stbBaseUrl){
		var url = stbBaseUrl+"/remoteControl/cmd?operation="+OperationCodeKeyEvent;
		url = url+"&key="+keycode+"&mode="+mode;
  		stbCall(url); 
	}
}

function stbZap(epgId){
	if(epgId=='1000000')epgId = '787';
	if(stbBaseUrl){
		//'*' padding
		epgId = new Array(10 - epgId.length + 1).join("*")+epgId;
		var url = stbBaseUrl+"/remoteControl/cmd?operation="+OperationCodeZap;
		url = url+"&epg_id="+epgId+"&uui=1";
  		stbCall(url); 
	}
}

function pushVODSheet(vodId,extend){
	extend = typeof extend !== 'undefined' ? mode : false;
	if(extend == false){
		//'*' padding
		vodId = new Array(50 - vodId.length + 1).join("*")+vodId;

		var url = stbBaseUrl+"/remoteControl/cmd?operation="+OperationCodePushVODInfoSheet;
		url = url + "&id="+vodId+"&type=0&request=0&code=0000";
		stbCall(url);
	}else{

	}
}

function testSTBBaseIP(ip){
	var testedStbBaseUrl = "http://192.168.1."+ip+":8080";
	
	$.ajax({
	  url:testedStbBaseUrl+"/remoteControl/cmd?operation=10",
	  dataType:"script",
	  cache:"true",
	  crossDomain:true,
	  statusCode: {
		200:function(){
			stbBaseUrl = testedStbBaseUrl;
			$('#debug').append("<div>STB base url: "+stbBaseUrl+"</div>");
		}
	  }
	});
}

