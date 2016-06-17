/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_info = {
	data : {},
	pageDiv : "#infoVentaP",

	init : function(data,template){

		console.log(data)
		ctrl_info.data = data;
		ctrl_info.render();
	},
	render : function(){

		var data  = paramsSuc.data 
	
		console.log(data)		

		var mainObj = template.render('#infoVentaT',ctrl_info.pageDiv,data)
		$(ctrl_info.pageDiv).trigger("create");


		var  myScroll = new IScroll('#wrapperInfo',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })


		setTimeout(function(){ myScroll.refresh() }, 500);
		

	}
}