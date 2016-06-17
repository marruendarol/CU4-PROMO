/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/

var ctrl_delegacion = {
	data : {},
	pageDiv : "#delegacionP",
	init : function(data,template){
		ctrl_delegacion.data = data;
		ctrl_delegacion.getMun();
		jqm.showLoader("Generando...");
	},
	getMun : function(){
		$.ajax({
          type: 'GET',
            data: {},
            crossDomain: true,
            url: serverURL + '/api/readSucMun/' + selDelegacion,
            dataType: 'JSON'
             }).done(function( response ) {
             ctrl_delegacion.render(response);
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	render : function(data){
		jqm.hideLoader();
		$(ctrl_delegacion.pageDiv).empty();

		var dItems = { items : data}
		console.log(dItems)

		var mainObj = template.render('#delegacionT',ctrl_delegacion.pageDiv,dItems)
		$(ctrl_delegacion.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			type = "delegacion"
			paramsPage = { id : event.context._id, type: "zona" }
			$.mobile.changePage( "#list");
		})

		 myScroll = new IScroll('#wrapperDel',{  
		 	click:true })
	},
}