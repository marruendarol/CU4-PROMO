/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_terminos = {
	data : {},
	pageDiv : "#terminosP",
	init : function(data,template){
		ctrl_terminos.data = data;
		ctrl_terminos.render();
	},
	render : function(){

		$(ctrl_terminos.pageDiv).empty();

		var mainObj = template.render('#terminosT',ctrl_terminos.pageDiv,{},null)


	}
}