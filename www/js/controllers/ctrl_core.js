/**********************************************************
*	CORE CONTROLLER
***********************************************************/

var ctrl_core = {

	path : "",
	id 	 : "",
	loadedControllers : [],
	init : function(){	
		ctrl_core.routeListeners();

		// login?
			var endDate = window.localStorage.getItem("end");

			console.log(utils.generateTS())
			console.log(parseInt(endDate))

			if(utils.generateTS()>parseInt(endDate))
			{
				//alert("Tarjeta Vencida, por favor registre una nueva tarjeta")
				
			}

			var username= window.localStorage.getItem("username");
			if(username!=undefined){
				ctrl_loginS.checkLogin({username:window.localStorage.getItem("username"),password:window.localStorage.getItem("password")})
			}else{
				$.mobile.changePage("#login")
			}

	  		
	},
	loadController : function(controllerURL,params,reload){
		
		if(reload || ctrl_core.loadedControllers.indexOf(controllerURL)==-1){
			$.ajax({
	        type: "GET",
	        url: controllerURL,
	        dataType: "script",
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(textStatus, errorThrown);
	        },
	        success:function(e){
	         	eval(params.init)(params);
	        }
    		});
		}else{
			eval(params.init)(params);
		}
		ctrl_core.loadedControllers.push(controllerURL)
		
	},
	routeListeners : function(){

		
		$(document).on("pagebeforeshow","#initialBlank", function() {
	       	var username= window.localStorage.getItem("username");
			if(username!=undefined){
				$.mobile.changePage("#mainScreen")
			}else{
				$.mobile.changePage("#firstP")
			}
	    });

		$(document).on("pagebeforeshow","#firstP", function() {
	        var params = { init : 'ctrl_first.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_first.js",params);
	    });

		$(document).on("pagebeforeshow","#login", function() {
	        	        var params = { init : 'ctrl_loginS.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_loginS.js",params);
	    });

		$(document).on("pagebeforeshow","#regVenta", function() {
	        var params = { init : 'ctrl_registroVenta.init', }
	    	ctrl_core.loadController("./js/controllers/ctrl_registroVenta.js",params);
	    });

	    $(document).on("pagebeforeshow","#recuperar", function() {
	        var params = { init : 'ctrl_recuperar.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_recuperar.js",params);
	    });

	
		$(document).on("pagebeforeshow","#mainScreen", function() {
	        var params = { init : 'ctrl_home.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_home.js",params);
	    });

	    $(document).on("pagebeforeshow","#listadoVentas", function() {
	      	var params = { init : 'ctrl_listadoVentas.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listadoVentas.js",params);
	    });

	     $(document).on("pagebeforeshow","#listadoInventario", function() {
	      	var params = { init : 'ctrl_listadoInventario.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listadoInventario.js",params);
	    });

	       $(document).on("pagebeforeshow","#infoInventario", function() {
	      	var params = { init : 'ctrl_infoInventario.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_infoInventario.js",params);
	    });


	    $(document).on("pagebeforeshow","#aviso", function() {
	        var params = { init : 'ctrl_aviso.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_aviso.js",params);
	    });

	    $(document).on("pagebeforeshow","#terminos", function() {
	        var params = { init : 'ctrl_terminos.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_terminos.js",params);
	    });

	    //----------------------------------------------------------------------------

	    $(document).on("pagebeforeshow","#infoVenta", function() {
	      	var params = { init : 'ctrl_info.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_info.js",params);
	    });

	    $(document).on("pagebeforeshow","#contacto", function() {
	      	var params = { init : 'ctrl_contacto.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_contacto.js",params);
	    });

	}

}