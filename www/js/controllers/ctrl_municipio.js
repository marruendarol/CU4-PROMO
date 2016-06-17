/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_municipio = {
	data : {},
	pageDiv : "#descuento",
	init : function(data,template){
		ctrl_municipio.data = data;
		ctrl_municipio.render();
	},
	getEstados : function(){

	},
	render : function(){


		$(ctrl_municipio.pageDiv).empty();

		var data  = {
			items : [
				{text: "Listado"},
				{text: "Por mayor porcentaje"},
				{text: "Especialidad"},
				{text: "Estado"},
				{text: "Zona"},
				
			]
		}

		var mainObj = template.render('#descuentoT',ctrl_municipio.pageDiv,data)
		$(ctrl_municipio.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		mainObj.on('getSuc',function(event){
			$.mobile.changePage( "#list");
		})
		

	},
}