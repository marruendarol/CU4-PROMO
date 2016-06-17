/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_espec = {
	data : {},
	pageDiv : "#especialidadP",
	init : function(data,template){
		ctrl_espec.data = data;
		ctrl_espec.getEspec();
		jqm.showLoader("Generando...");
	},
	getEspec : function(){
		$.ajax({
          type: 'POST',
            data: {id:paramsPage.id},
            crossDomain: true,
            url: serverURL + '/api/readespecApp' ,
            dataType: 'JSON'
             }).done(function( response ) {
             ctrl_espec.render(response);
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	render : function(data){

		jqm.hideLoader();

		$(ctrl_espec.pageDiv).empty();

		var dItems = data

		var mainObj = template.render('#especT',ctrl_espec.pageDiv,data)
		$(ctrl_espec.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			paramsPage = { id : event.context.nombre, type: "especialidad" }
			if(descVar==''){
					$.mobile.changePage( "#list");	
			}
			else{
				if(descVar=="mayor"){
					paramsPage = { type: "DescMayor",id : event.context.nombre }
					$.mobile.changePage("#descMayor");
				}
				if(descVar=="cercania"){
					paramsPage = {  type: "listDesc",id : event.context.nombre }
					$.mobile.changePage("#listDesc");
				}
			}
		})
		
			 myScroll = new IScroll('#wrapperEspec',{  
		 	click:true,bounce:false,bindToWrapper: true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

	},
}