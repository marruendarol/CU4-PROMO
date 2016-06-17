/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_infoInventario = {
	data : {},
	pageDiv : "#infoInventarioP",

	init : function(data,template){
		ctrl_infoInventario.data = data;

		ctrl_infoInventario.getModelo(paramsSuc.data._id);
	},
	getModelo : function(id){
		dbC.query("/api/readModelo","POST",{nombre:id},ctrl_infoInventario.render)
	},
	render : function(data){

		var data  = data.data[0]
	
		console.log("Regresio data")
		console.log(data)		

		var mainObj = template.render('#infoInventarioT',ctrl_infoInventario.pageDiv,data)
		$(ctrl_infoInventario.pageDiv).trigger("create");


		var  myScroll = new IScroll('#wrapperInfoInventario',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })


		setTimeout(function(){ myScroll.refresh() }, 500);
		

	}
}