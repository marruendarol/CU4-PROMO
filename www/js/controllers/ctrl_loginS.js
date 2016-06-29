/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_loginS = {
	data : {},
	pageDiv : "#loginP",
	init : function(data,template){
		ctrl_loginS.data = data;


		var username= window.localStorage.getItem("username");
			if(username!=undefined){
				
				$.mobile.changePage("#regVenta")
				bPos.init();
				//wPos.startWP()
			}else{
				ctrl_loginS.render();
			}
		
	},
	render : function(){

		$(ctrl_loginS.pageDiv).empty();

		var mainObj = template.render('#loginT',ctrl_loginS.pageDiv,{},null)

		mainObj.on('ingresar',function(){
			var user = $('#name').val();
			var pass = $('#password').val();
			jqm.showLoader("ingresando...");
			ctrl_loginS.checkLogin({username:user,password:pass})
		});

			mainObj.on('cancelar',function(){
			$.mobile.changePage( "#regVenta");
		});



		$(ctrl_loginS.pageDiv).trigger("create");

	},
	checkLogin : function(data){
        $.ajax({
            type: 'POST',
            data: data,
            url: serverURL + '/api/loginiuser',
            dataType: 'JSON'
            }).done(function( response ) {
              	jqm.hideLoader();
            	if(response!=null){

            		console.log(response)
            		userdata = response
            		window.localStorage.setItem("username", response.email);
            		window.localStorage.setItem("nombre", response.nombre);
            		window.localStorage.setItem("password", response.password);
            		window.localStorage.setItem("userId", response._id);
            		window.localStorage.setItem("supervisor", response.supervisor);
            		window.localStorage.setItem("tienda", response.tienda);

    				
            		ctrl_loginS.changePage();	
            		//wPos.startWP()
            		bPos.init();
            	}else{
            		jqm.popup( {text:"Usuario y/o contraseña inválido",title:"Error."})
            	}
            	
        });	
	},
	changePage : function(){
		$.mobile.changePage( "#regVenta", {});
	}
}