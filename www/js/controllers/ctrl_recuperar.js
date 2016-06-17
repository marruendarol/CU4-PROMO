/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_recuperar = {
	data : {},
	pageDiv : "#recuperarP",
	init : function(data,template){
		ctrl_recuperar.data = data;
		ctrl_recuperar.render();
	},
	render : function(){

		$(ctrl_recuperar.pageDiv).empty();

		var mainObj = template.render('#recuperarT',ctrl_recuperar.pageDiv,{},null)


		mainObj.on('recuperar',function(){
			ctrl_recuperar.sendMsg();
		});


		$(ctrl_recuperar.pageDiv).trigger("create");

	},
	sendMsg : function(){
		jqm.showLoader("Enviando mensaje...")
		
		var params = {email:$('#email').val()};
		dbC.query("/api/recovery","POST",params,ctrl_recuperar.msgRet,params,null)
	},
	msgRet : function(response){
		jqm.hideLoader();
		$.mobile.changePage( "#recuperarListo");
	}
}