/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/


var ctrl_listDesc = {
	data : {},
	pageDiv : "#listDescP",
	init : function(data,template){
		ctrl_listDesc.data = data;
		ctrl_listDesc.getLoc();
		jqm.showLoader("Generando...");
	},
	getLoc : function(){
		getLastKnownLocation(ctrl_listDesc.getQuery,ctrl_listDesc.onLocationError,false)	
	},
	getQuery : function(position){
		console.log(position)
		$.ajax({
          type: 'POST',
            data: {spec:paramsPage.id,lat:position.coords.latitude,lng:position.coords.longitude},
            url: serverURL + '/api/byListaDesc',
            crossDomain: true,
            dataType: 'JSON'
             }).done(function( response ) {
             ctrl_listDesc.render(response);
          }).fail(function( response ) {
              alert("Error de conexión, intente nuevamente mas tarde.");   
    	});   
	},
	onLocationError : function(err){
		alert("No se puede obtener su locaclización GPS, por favor revise que la función este habilitada o que su GPS este en un rango operacional. " + err)
	},
	render : function(data){
		jqm.hideLoader();
		$(ctrl_listDesc.pageDiv).empty();

		for (var i = 0; i < data.length; i++) {
			
			//search Item
			for (var a = 0; a < data[i].descuentos.length; a++) {
				if(data[i].descuentos[a].espec == paramsPage.id){
						data[i].descuentos.move(a,0)
				}
			};

			data[i].perc = parseInt(data[i].descuentos[0].perc);
		};

		data.sort(byProperty('perc'))
		data.reverse();

		data.sort(byProperty('dist'))



		var dItems = { items : data,  distVis:true , img 		: "noimage.png"}

		console.log(dItems)

		ctrl_listDesc.mainObj = template.render('#listDescT',ctrl_listDesc.pageDiv,dItems)
		$(ctrl_listDesc.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		ctrl_listDesc.mainObj.on('getList',function(event){
			console.log(event.context._id +"MAMAMIA")
			paramsPage = { id : event.context._id, type: "descListado" }
			$.mobile.changePage( "#list");
		})

		ctrl_listDesc.mainObj.on('getSuc',function(event){
			console.log(event.context._id +"MAMAMIA")
			paramsSuc = { data : event.context }
			$.mobile.changePage( "#infoSuc");
		})

		 myScroll = new IScroll('#wrapperListDesc',{  
		 	click:true ,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		  ctrl_listDesc.mainObj.on('openLink',function(event){
				window.open(event.context.urlLink, '_system')
			});

		 ctrl_listDesc.getBanner();
		

	},
	getBanner : function(){
		$.ajax({
          type: 'POST',
            data: {},
            url: serverURL + '/api/getBanner',
            crossDomain: true,
            dataType: 'JSON'
             }).done(function( response ) {
             	ctrl_listDesc.mainObj.set('img',response.imagenes[0].url)
             	ctrl_listDesc.mainObj.set('urlLink',response.imagenes[0].urlLink)
              	
          }).fail(function( response ) {
              console.log("banner error ")  
    	});   
	}
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function dataType(arr){
	for (var i = 0; i < arr.descuentos.length; i++) {
		arr[i].perc = parseInt(arr[i].perc)
	};
}

var byProperty = function(prop) {
    return function(a,b) {
        if (typeof a[prop] == "number") {
            return (a[prop] - b[prop]);
        } else {
            return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
        }
    };
};