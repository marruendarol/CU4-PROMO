/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var spec = "";

var ctrl_listadoVentas = {
	data : {},
	pageDiv : "#listadoVentaP",
	init : function(data,template){
		console.log('LOGER')
		ctrl_listadoVentas.data = data;
		$(ctrl_listadoVentas.pageDiv).empty();
		jqm.showLoader("buscando...");

		ctrl_listadoVentas.getVentas()


	//--------------------------------------------ZONA
	},
	getVentas : function(id){
		dbC.query("/api/readHistorico","POST",{idUser:window.localStorage.getItem("userId")},ctrl_listadoVentas.render)
	},
	//-----------------------------------------------------------
	render : function(data){


		jqm.hideLoader();
		
		var datar = { items  : data,
					  empty 	: (data.length==0 ? true : false),
			}

		$('#titleList').text("Ventas")

		ctrl_listadoVentas.mainObj = template.render('#listadoVentaT',ctrl_listadoVentas.pageDiv,datar)

		ctrl_listadoVentas.mainObj.on('listDetail',function(event){
			mainC.clickAnim(event.node)
			paramsSuc = { data : event.context }
			$.mobile.changePage( "#infoVenta");
		});

		$(ctrl_listadoVentas.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		 ctrl_listadoVentas.mainObj.on('openLink',function(event){
				window.open(event.context.urlLink, '_system')
			});
		
	
	}
}