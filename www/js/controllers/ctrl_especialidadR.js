/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_especR = {
	data : {},
	pageDiv : "#especialidadRP",
	init : function(data,template){
		console.log(paramsPage,"DATA PROV")
		ctrl_especR.data = data;
		ctrl_especR.getEspec();
		jqm.showLoader("Generando...");
	},
	getEspec : function(){
		$.ajax({
          type: 'POST',
            data: {},
            crossDomain: true,
            url: serverURL + '/api/readespecR/' ,
            dataType: 'JSON'
             }).done(function( response ) {
             ctrl_especR.render(response);
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	render : function(data){

		jqm.hideLoader();

		$(ctrl_especR.pageDiv).empty();

		var dItems = data

		var mainObj = template.render('#especRT',ctrl_especR.pageDiv,data)
		$(ctrl_especR.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			paramsPage = { id : event.context.nombre, type: "especialidad" }
			$.mobile.changePage( "#especialidad");
		})
		
			 myScroll = new IScroll('#wrapperEspecR',{  
		 	click:true,bounce:false,bindToWrapper: true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

	},
}