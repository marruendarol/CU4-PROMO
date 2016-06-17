/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/


var ctrl_listDesc = {
	data : {},
	pageDiv : "#especDescP",
	init : function(data,template){
		ctrl_listDesc.data = data;
		ctrl_listDesc.getQuery();
		jqm.showLoader("Generando...");
	},
	getQuery : function(){
		$.ajax({
          type: 'POST',
            data: {},
            url: serverURL + '/api/byEspecDesc',
            crossDomain: true,
            dataType: 'JSON'
             }).done(function( response ) {
             ctrl_listDesc.render(response);
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	render : function(data){
		jqm.hideLoader();
		$(ctrl_listDesc.pageDiv).empty();

		var dItems = { items : data}

		console.log(dItems)

		var mainObj = template.render('#especDescT',ctrl_listDesc.pageDiv,dItems)
		$(ctrl_listDesc.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getList',function(event){
			console.log(event.context._id +"MAMAMIA")
			paramsPage = { id : event.context._id, type: "descListado" }
			$.mobile.changePage( "#list");
		})

		 myScroll = new IScroll('#wrapperListDesc',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })
		

	},
}