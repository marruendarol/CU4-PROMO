/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_anadir = {
	data : {},
	pageDiv : "#insertCardP",
	card : {},
	life : "",
	init : function(data,template){
		ctrl_anadir.data = data;
		ctrl_anadir.render();
	},
	render : function(){

		$(ctrl_anadir.pageDiv).empty();

		var mainObj = template.render('#cardT',ctrl_anadir.pageDiv,{},null)

		$(document).foundation();  // Refresh for tooltips

		mainObj.on('validate',function(){
			jqm.showLoader("verificando tarjeta...");
			ctrl_anadir.validateCard($("#cardA").val(),$("#ccvA").val());
		});	

		mainObj.on('cancelar',function(){
			$.mobile.changePage( "#firstP" );
		});

		$(ctrl_anadir.pageDiv).trigger("updateCard");

		  	 myScroll = new IScroll('#wrapperReg',{ click:true })
 	 

	},
	validateCard : function(idCard,ccv){
		ctrl_anadir.card = idCard;
		ctrl_anadir.ccv = ccv;
		var params = {idCard:idCard,ccv : ccv};
		dbC.query("/api/checkCard","POST",params,ctrl_anadir.validReturn)
	},
	tsPlus : function(dias){
		var today = new Date();
		var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate()+parseInt(dias));
		console.log(tomorrow)
		console.log(dias)
		console.log(utils.generateTS(tomorrow))
		return utils.generateTS(tomorrow);
	},
	validReturn : function(response){

		jqm.hideLoader();

		if(response.length==1 && response[0].estatus=="0" ){ 
			ctrl_anadir.updateCard(response[0]);	
		}

		if(response.length==0){
			jqm.popup( {text:"El ID de la tarjeta o el CCV no es válido.",title:"Error."})

		}
		
		if(response.length==1 && response[0].estatus=="1"){
			jqm.popup( {text:"Esa ya ha sido registrada. verifique de nuevo o pongase en contacto con su proveedor",title:"Error."})	
		}
	},
	updateCard:function(card){
		jqm.showLoader("actualizando...");
		// Client Obj	
		console.log(card.dias)
		console.log("DASI CARD")

		var params = {}
		params.end  = ctrl_anadir.tsPlus(card.dias);
		params.idCard = ctrl_anadir.card 
		params.ccv = ctrl_anadir.ccv 
		params.userId = window.localStorage.getItem("userId");
		params.card = card;
		console.log(params)
		console.log("info de update")
		dbC.query("/api/updateUserMobile","POST",params,ctrl_anadir.updateCard_Return)
	},
	updateCard_Return : function(data){
		var params = {idCard:ctrl_anadir.card, username : window.localStorage.getItem("username") }
		dbC.query("/api/updateCard","POST",params,ctrl_anadir.updateCardCardRet)	
	},
	updateCardCardRet : function(){
		console.log(ctrl_anadir.username)
		console.log(ctrl_anadir.pass)
		ctrl_loginS.checkLogin({username:window.localStorage.getItem("username"),password:window.localStorage.getItem("password")})
	}
}