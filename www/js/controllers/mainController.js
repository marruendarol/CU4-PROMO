/**********************************************************
*	MAIN CONTROLLER
***********************************************************/

var userLat = 20.6596
var userLng = -103.3496
//var serverURL = "http://autotips.mx:3018";
var serverURL = "http://promo.capitalpeople.mx:3033";
var paramsPage = {}
var scrolls = false;

var mainC = {
	init: function(callback){
		mainC.initFoundation();
		mainC.loadTemplateFile(callback)
	},
	initFoundation : function(){
		$(document).foundation();
		$(document).foundation('alert','events');

		// Abide Validation
		$(document).foundation('abide', {
	      patterns: {
	        short_field: /^.{,40}$/,
	        long_field: /^.{,72}$/
	      }
    	}); 
	},
	loadTemplateFile: function(callback){
		$("#templateLoader").load("./templates/views.html",function(){
			callback();
		}); 
	},
	comboArray : function(extra){
		$(extra.div).append('<option value="" disabled selected>'+extra.placeholder+'</option>')
		for (var a in extra.arr){
			$(extra.div).append('<option value="'+ extra.arr[a][extra.value] +'">' + extra.arr[a][extra.label] +'</option>')
		}
		if(extra.defaultVal!=null){
			$(extra.div).val(extra.defaultVal);
		}
	},
	clickAnim : function(el){
		$(el).animate({backgroundColor: '#666'},200, function(){ $(el).animate({backgroundColor: '#000'}, 'slow', function(){  }) })
	}
}

var jqm = {
	showLoader : function(text){
		console.log("show loader")
		$.mobile.loading( "show", {
		  text: text || "",
		  textVisible: true,
		  theme: "z",
		  html: ""
		});
	},
	hideLoader : function(){
		console.log("hide loader")
		$.mobile.loading( "hide", {
		  text: "",
		  textVisible: true,
		  theme: "z",
		  html: ""
		});
	},
	popup : function(params){
		$('#pop_Title').html(params.title)
		$('#pop_text').html(params.text)
		$( "#pop1" ).popup( "open" )
	}
}

/**********************************************************
*	FOUNDATION CONTROLLERS
***********************************************************/
var foundationJS = {
	createAlert : function(msg,div,tipo){
		template.render('#alertT',div,{msg:msg,tipo:tipo});
	}
}


/**********************************************************
*	TEMPLATE RENDERER
***********************************************************/
var template = {
	render: function(template,output,data,callback,partials){
		var options = {
		  el: output,
		  template:  template,
		  partials: partials,
		  data : data
		}
		// BIND HELPERS
		for (var a in rh){
			options.data[a] = rh[a];
		}
		var ractive = new Ractive(options);
		// IF CALLBACK
		if(callback) { callback()};
		return ractive;
	},
	setListeners : function(){

	},
	update: function(){

	},

}


/**********************************************************
*	DATABASE CONTROLLER
***********************************************************/
var dbC = {
	query : function(url,type,params,callback,errorCB,extra){
		 $.ajax({
	        type: type,
	        data: params,
	        crossDomain: true,
            url: serverURL + url,
	        dataType: 'JSON',
	        }).done(function( response ) {
        		if(callback) { callback(response,extra) }
	        }).fail(function( response ) {
	           	console.log("fail query",response,extra);
	           	if(errorCB) { errorCB(response,extra) }
	    }); 
	}
}


/**********************************************************
*	REACTIVE HANDLERS
***********************************************************/
var rh = {
	checked : function(lvalue,rvalue,defaultVal){
		if(lvalue==undefined && defaultVal){ lvalue = defaultVal; }
		if( lvalue==rvalue ) {
	       return ' checked="checked"'  } else { return "" };
	},
	timeConverter : function(value){
		return utils.timeConverter(value);
	},
	correctCase : function(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},
	roundDist : function(value){
		return value.toFixed(2);
	},
	maskTel : function(value){
		return value.replace(/(.{2})(.{4})(.{4})/,'$1 $2 $3 ');
	},
	restantes : function(value){
		var date1 = new Date(parseInt(value)*1000);
		var date2 = new Date();
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

		if(utils.generateTS()>parseInt(value)){
			return "TARJETA VENCIDA";
		}else{
			return diffDays;
		}

		
	},
	cCase  : function(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},
	formatMoney : function(val,c,d,t){
		var n = val, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}
}




