/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var spec = "";

var ctrl_listadoInventario = {
	data : {},
	pageDiv : "#listadoInventarioP",
	init : function(data,template){
		console.log('LOGER')
		ctrl_listadoInventario.data = data;
		$(ctrl_listadoInventario.pageDiv).empty();
		jqm.showLoader("buscando...");

		ctrl_listadoInventario.getInventario()


	//--------------------------------------------ZONA
	},
	getInventario : function(id){

		dbC.query("/api/readInventario","POST",{idUser:window.localStorage.getItem("userId"),
												'tienda': window.localStorage.getItem("tienda"),
												'supervisor': window.localStorage.getItem("supervisor")},ctrl_listadoInventario.render)
	},
	//-----------------------------------------------------------
	render : function(data){

		jqm.hideLoader();
		
		var datar = { items  : data,
					  empty 	: (data.length==0 ? true : false),
			}


			console.log(ctrl_listadoInventario.pageDiv)

		$('#titleList').text("Inventario")

		ctrl_listadoInventario.mainObj = template.render('#listadoInventarioT',ctrl_listadoInventario.pageDiv,datar)

		ctrl_listadoInventario.mainObj.on('listDetail',function(event){
			mainC.clickAnim(event.node)
			paramsSuc = { data : event.context }
			$.mobile.changePage( "#infoInventario");
		});

		$(ctrl_listadoInventario.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperInventario',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		 ctrl_listadoInventario.mainObj.on('openLink',function(event){
				window.open(event.context.urlLink, '_system')
			});
		
	
	}
}