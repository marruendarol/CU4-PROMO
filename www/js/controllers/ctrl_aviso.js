/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_aviso = {
	data : {},
	pageDiv : "#avisoP",
	init : function(data,template){
		ctrl_aviso.data = data;
		ctrl_aviso.render();
	},
	render : function(){

		$(ctrl_aviso.pageDiv).empty();

		var mainObj = template.render('#avisoT',ctrl_aviso.pageDiv,{},null)


	}
}