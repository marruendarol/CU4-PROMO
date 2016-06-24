/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_registroVenta = {
	data : {},
	pageDiv : "#registroP",
	card : {},
	life : "",
	unidades : [],
	init : function(data,template){
		ctrl_registroVenta.data = data;
		ctrl_registroVenta.render();
	},
	render : function(){

		$(ctrl_registroVenta.pageDiv).empty();


		var data  = {
			userData : {
				nombre 		: window.localStorage.getItem("nombre"),
				username 	: window.localStorage.getItem("email"),
				unidades 	: []
			},
			img 		: "noimage.png",
		}


		 ctrl_registroVenta.mainObj = template.render('#registroVentaT',ctrl_registroVenta.pageDiv,data,null)

		$(document).foundation();  // Refresh for tooltips

		ctrl_registroVenta.mainObj.on('validate',function(){
			jqm.showLoader("verificando ticket...");
			ctrl_registroVenta.validateTicket($("#idTicket").val());
		});	

		ctrl_registroVenta.mainObj.on('cancelar',function(){
			$.mobile.changePage( "#firstP" );
		});

		$(ctrl_registroVenta.pageDiv).trigger("create");

			$("#movil").mask("9999999.99");

		  	

		 ctrl_registroVenta.getExternal({
							url 		:"/api/modelosR",
							div  		:"#modelos",
							value		:'_id',
							label		:'nombre',
							placeholder	: "Seleccione un modelo",
							defaultVal	: { }
							}); 

		  	 
		ctrl_registroVenta.mainObj.on('cerrarsesion',function(event){
				mainC.clickAnim(event.node)
				localStorage.clear();
				$.mobile.changePage("#login");
			});


		ctrl_registroVenta.mainObj.on('agregarUnidad',function(){

			var rObj= {
				noserie : $('#serie').val(), 
			}
			ctrl_registroVenta.validateSerie(rObj.noserie)
		})

		  $('#monto').inputmask("numeric", {
			    radixPoint: ".",
			    groupSeparator: ",",
			    digits: 2,
			    autoGroup: true,
			    prefix: '$', //No Space, this will truncate the first character
			    rightAlign: false,
			    oncleared: function () { self.Value(''); }
			});


		   ctrl_registroVenta.myScroll = new IScroll('#wrapperReg',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })



	},
	validateSerie : function(noserie){
		var params = {noserie:noserie};
		dbC.query("/api/checkSerie","POST",params,ctrl_registroVenta.serieReturn)
	},
	serieReturn : function(response){

		console.log(response)
		jqm.hideLoader();


		if(response.length==0){
			jqm.popup( {text:"No existe el número de serie.",title:"Error."});
		} else{

			switch(response[0].estatus){
				case 'VENDIDA' : jqm.popup( {text:"La unidad ya esta registrada como vendida.",title:"Error."});break;
				case 'DISPONIBLE' : 				ctrl_registroVenta.unidades.push(response[0]);
													ctrl_registroVenta.mainObj.set('unidades',ctrl_registroVenta.unidades);
													$('#monto').val(ctrl_registroVenta.getMontoTotal());
													ctrl_registroVenta.myScroll.refresh() 
													break;
										
			}
		}

	
	},
	validateTicket : function(idTicket){
		ctrl_registroVenta.idTicket = idTicket;
		var params = {idTicket:idTicket};
		dbC.query("/api/checkTicket","POST",params,ctrl_registroVenta.validReturn)
	},
	validReturn : function(response){

		console.log(response)
		jqm.hideLoader();

			if(response.length>0){
			jqm.popup( {text:"Este ticket ya ha sido previamente registrado.",title:"Error."})

		}else{
			ctrl_registroVenta.getPos();	
		}
	
	},
	getPos : function(){
		var options = { maximumAge: 10000, timeout: 4000, enableHighAccuracy: true };
		 var watchId = navigator.geolocation.getCurrentPosition(ctrl_registroVenta.getPosRet,
                                                        		ctrl_registroVenta.getPosErr,
                                                        		options);
	},
	getMontoTotal : function(){
		var suma = 0;
		console.log(ctrl_registroVenta.unidades)
		for (var i = 0; i < ctrl_registroVenta.unidades.length; i++) {
			suma += parseFloat(ctrl_registroVenta.unidades[i].precio)
			console.log(suma)
		}
		return suma;
	},
	getPosRet : function(position){
		console.log("position")
		console.log(position)
		ctrl_registroVenta.create(position)
	},
	getPosErr : function(){
		var position = {'status': "error getting location"}
		ctrl_registroVenta.create(position)
	},
	getDataObj :function(){
		var dataObj = {};
		var errs = [];
		dataObj.idTicket	= $("#idTicket").val(); 
		dataObj.monto 	 	= $("#monto").inputmask('unmaskedvalue');
		dataObj.montoMask 	= $("#monto").val(); 
		dataObj.modelo 	 	= $("#origen").val(); 
		dataObj.unidades 	= ctrl_registroVenta.unidades;

		if(dataObj.idTicket.length<2) { errs.push("idTicket Requerido")}
		//if(dataObj.monto.length<2) { errs.push("Monto total requerido")}

		if(ctrl_registroVenta.unidades.length==0) { errs.push("Agregue números de serie de teléfonos válidos.")}	
		
		if(errs.length==0){
			return dataObj;
		}else{
			jqm.hideLoader();
			jqm.popup( {text:errs.toString(),title:"Aviso."})
		}

    	
	},
	create:function(position){
		jqm.showLoader("registrando venta...");
		// Client Obj
		var item = {	ts 			: utils.generateTS(),
						id 			: utils.generateUUID()};


		var params = {}
		params.dataB = ctrl_registroVenta.getDataObj(); 
		params.dataB.clients = [item];
		params.dataB.position = position;
		params.dataB.ts = utils.generateTS();
		params.dataB.userID =  window.localStorage.getItem("userId");
    	params.dataB.username = window.localStorage.getItem("username");
		params.dataB.estRCD = 1;
		dbC.query("/api/createVenta","POST",params,ctrl_registroVenta.create_Return,ctrl_registroVenta.create_Error)
	},
	create_Return : function(response){
		console.log(response)
		
		jqm.hideLoader();
		ctrl_registroVenta.unidades = [];
		$('#serie').val("");
		$('#idTicket').val("");
		$('#monto').val("");
		ctrl_registroVenta.mainObj.set('unidades',ctrl_registroVenta.unidades);

		jqm.popup( {text:"Venta registrada con éxito",title:"Venta"})
	},
	create_Error : function(err){
		console.log(err)
	},
	getExternal : function(extra){


		console.log(extra)
		var params = {}
		dbC.query(extra.url,"POST",params,ctrl_registroVenta.external_Return,null,extra)
	},
	external_Return : function(result,extra){

		console.log(extra)
				// Place Holder
		$(extra.div).append('<option value="" disabled selected>'+extra.placeholder+'</option>')

		for (var a in result.data){
			$(extra.div).append('<option value="'+ result.data[a][extra.value] +'">' + result.data[a][extra.label] +'</option>')
		}
		console.log(extra.defaultVal,"valor extra")
		if(extra.defaultVal!=null){
			$(extra.div).val(extra.defaultVal);
		}
	}
}