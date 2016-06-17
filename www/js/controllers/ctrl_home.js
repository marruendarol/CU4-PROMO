/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
descVar = ""

var ctrl_home = {
	data : {},
	pageDiv : "#mainScreen",
	init : function(data,template){
		ctrl_home.data = data;
		ctrl_home.render();
	},
	render : function(){


		$(ctrl_home.pageDiv).empty();

		ctrl_home.data  = {
			userData : {
				nombre 		: window.localStorage.getItem("nombre"),
				username 	: window.localStorage.getItem("email"),
			},
			img 		: "noimage.png",
		}

		// check vencida

	
			 ctrl_home.mainObj = template.render('#mainT',ctrl_home.pageDiv,ctrl_home.data,null,{menuT : $('#menuT').html()})
			$(ctrl_home.pageDiv).trigger("create");
			//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			
			ctrl_home.mainObj.on('regVenta',function(event){
				
				mainC.clickAnim(event.node)
				paramsPage = { id : event.context._id, type: "venta" }
				$.mobile.changePage("#regVenta");
			})
			ctrl_home.mainObj.on('getHistorico',function(event){
				mainC.clickAnim(event.node)
				paramsPage = { id : event.context._id }
				$.mobile.changePage("#listadoVentas");
			})
			ctrl_home.mainObj.on('getZona',function(event){
				mainC.clickAnim(event.node)
				$.mobile.changePage("#zona");
			})
			ctrl_home.mainObj.on('getEspecialidad',function(event){
				mainC.clickAnim(event.node)
				$.mobile.changePage("#especialidadR");
			})
			ctrl_home.mainObj.on('getContacto',function(event){
				mainC.clickAnim(event.node)
				$.mobile.changePage("#contacto");
			})


			ctrl_home.mainObj.on('cerrarsesion',function(event){
				mainC.clickAnim(event.node)
				localStorage.clear();
				$.mobile.changePage("#login");
			});

			ctrl_home.mainObj.on('openLink',function(event){
				console.log(event.context)
				ctrl_home.updateClick(event.context.bannerId)
				window.open(event.context.urlLink, '_system')
				//navigator.app.loadUrl(event.context.urlLink,{openExternal:true})
			});

		 //ctrl_home.getLocation();

	},
	getLocation: function(){
		navigator.geolocation.getCurrentPosition(ctrl_home.onLocationFound, ctrl_home.onLocationError,{maximumAge:3000,timeout:35000,enableHighAccuracy:false});
	},
	onLocationFound : function(position){
		
		var pos = position.coords;
		userLat = pos.latitude;
		userLng = pos.longitude;

		console.log(userLat + " - " + userLng + " user found")
	},
	onLocationError : function(){
		alert("No se puede obtener su locaclización GPS, por favor revise que la función este habilitada o que su GPS este en un rango operacional.")
	}
	
}