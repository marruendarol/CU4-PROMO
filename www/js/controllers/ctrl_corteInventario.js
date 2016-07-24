/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var spec = "";

var ctrl_corteI = {
	data : {},
	pageDiv : "#corteInventarioP",
	init : function(data,template){
		console.log('LOGER')
		ctrl_corteI.data = data;
		$(ctrl_corteI.pageDiv).empty();
		jqm.showLoader("buscando...");

		ctrl_corteI.getInventario()


	//--------------------------------------------ZONA
	},
	getInventario : function(id){

		dbC.query("/api/readCorte","POST",{idUser:window.localStorage.getItem("userId")},ctrl_corteI.inventarioRet)
	},

	//-----------------------------------------------------------
	inventarioRet :  function(result){
		ctrl_corteI.corteRS = result
		ctrl_corteI.getModelos();
	},
	getModelos : function(){
		dbC.query("/api/readModelos","POST",{},ctrl_corteI.modelosRet)
	},
	modelosRet : function(result){
		ctrl_corteI.modelosRS = result;
		ctrl_corteI.render()
	},
	render : function(data){

		jqm.hideLoader();

		

		ctrl_corteI.procRes()

			var datar = { modelos  : ctrl_corteI.modelosRS,
					  empty 	: (ctrl_corteI.modelosRS.length==0 ? true : false),
			}

		$('#titleList').text("Inventario")

		ctrl_corteI.mainObj = template.render('#corteInventarioT',ctrl_corteI.pageDiv,datar)

		ctrl_corteI.mainObj.on('addItem',function(event){
			jqm.showLoader("actualizando...");
			var idItem = event.context._id;
			var idUser = window.localStorage.getItem("userId");
			dbC.query("/api/addItem","POST",{idItem:idItem,idUser:idUser},ctrl_corteI.addRet)
		});


		ctrl_corteI.mainObj.on('remItem',function(event){
			jqm.showLoader("actualizando...");
			var idItem = event.context._id;
			var idUser = window.localStorage.getItem("userId");
			dbC.query("/api/remItem","POST",{idItem:idItem,idUser:idUser},ctrl_corteI.remRet)
		});



		$(ctrl_corteI.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperInventario',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		
	
	},
	procRes : function(){
		for (var i = 0; i < ctrl_corteI.modelosRS.length; i++) {
			var idItem =  ctrl_corteI.modelosRS[i]._id;
			var count = JSON.search(ctrl_corteI.corteRS,'//*[idItem="'+ idItem+'"]');
			console.log(count,"CUENTA")
			if(count[0]!=undefined){
				ctrl_corteI.modelosRS[i]['count'] = count[0].count;
			}
			else{
				ctrl_corteI.modelosRS[i]['count'] =  0;
			}

		}
		
	




	},
	addRet : function(e){
		jqm.hideLoader();
		ctrl_corteI.corteRS = e
		ctrl_corteI.procRes();
		ctrl_corteI.mainObj.set('modelos',ctrl_corteI.modelosRS)
	},
	remRet : function(e){
		jqm.hideLoader();
		ctrl_corteI.corteRS = e
		ctrl_corteI.procRes();
		ctrl_corteI.mainObj.set('modelos',ctrl_corteI.modelosRS)
	}


}