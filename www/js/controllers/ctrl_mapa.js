var distanceOnmap=[];
var selecrank=0;


var ctrl_mapa = {
	data : {},
	pageDiv : "#mapaP",
	init : function(data,template){
		ctrl_mapa.data = data;
		ctrl_mapa.render();
	},
	render : function(){

		var data  = {}

		var mainObj = template.render('#mapaT',ctrl_mapa.pageDiv,data)
		$(ctrl_mapa.pageDiv).trigger("create");

		 ctrl_mapa.routeInit()

	
	},
	routeInit : function(){
		//navigator.geolocation.getCurrentPosition(ctrl_mapa.routeProc, ctrl_mapa.routeErr,{maximumAge:3000,timeout:35000,enableHighAccuracy:false});
		ctrl_mapa.routeProc()
	},
	routeProc : function(location){
		console.log(mapaObj)
		//mMapa.init(location.coords.latitude,location.coords.longitude);

		mMapa.init(mapaObj.loc[0],mapaObj.loc[1]);

		//var data = [{loc : {lat: mapaObj.lat, lng: mapaObj.lng}, COLOR:"8B1D1B", LOGOTIPO:"",BUSSINESS:{ CATEGORY:1, NAME:"Autotips"}}]
		//mMapa.addPins(data)
		
		// Add Route
		//var params = { start : { lat: location.coords.latitude, lng : location.coords.longitude }, end : {lat: mapaObj.lat, lng: mapaObj.lng }}
		//mMapa.traceRoute(params.start,params.end)

		//console.log(mMapa.bounds)
		//mMapa.map.fitBounds(mMapa.bounds);
	},
	routeErr : function(err){
		console.log(err)
	}

}




// leaflef Mapa ----------------------------------------------------
var ms = {
	oVars : {
		categories : {},
		selCat : "",
	},
	restRes : {},
	init : function(){
		mMapa.init(); 
		// Init Geo Google Coder
		gGeo.init();
	
	},
	filtrosDefault: function(){
		var filtros = {
            'latitude': mMapa.oVars.lat,
            'longitude': mMapa.oVars.lng,
            'chkDistance': .06,
           // 'chkPrice': 1,
            'txtSearch': "",
            'sortDistance': 1,
            'sortOrder': "_id",
        };
        return filtros;
	},
	searchNearBy : function(){
		var filtros = ms.setFiltro();
        url= '/usuarios/searchnearby';
        $.ajax({
            type: 'POST',
            data: filtros,
            url: url,
            dataType: 'JSON'
            }).done(function( data ) {
            	ms.restRes = data;
            	mMapa.addPins(data);
            	mList.setList(data);
        });	
	}
}

var mMapa = {
	oVars : {
		defaultLat: 20.6596,
		defaultLng: -103.3496,
		lat :"", 
		lng :"",
		zoom : 12,
		defaultPin : "D76627"
	},
	map  : {},
	userLocation : {},
	marker : [],
	bounds : {},	
	init : function(lat,lng){
		mMapa.bounds = new google.maps.LatLngBounds();
		mMapa.initMap(lat,lng);
	},
	getMapCookies : function(){
	    mMapa.oVars.lat	 			= utils.getCookie('lat',mMapa.oVars.defaultLat);
	    mMapa.oVars.lng 			= utils.getCookie('lng',mMapa.oVars.defaultLng);
	},
	setMapCookies : function(lat,lng){
		console.log("setting map cookies")
		var d = new Date();
   		d.setTime(d.getTime() + (1*24*60*60*1000));
    	document.cookie="lat="+ lat +";expires="+d.toUTCString();
    	document.cookie="lng="+ lng +";expires="+d.toUTCString();
    	mMapa.oVars.lat = lat;
        mMapa.oVars.lng = lng;
	},
	initMap: function(lat,lng){

		var latLng = new google.maps.LatLng(lat,lng)


		var mapOptions = {
			center : latLng,
			zoom : 16,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		}

		 mMapa.map = new google.maps.Map(document.getElementById('ubica'),mapOptions)

		 var markerImage = new google.maps.MarkerImage('/img/8B1D1B.png',
                new google.maps.Size(51, 43),
                new google.maps.Point(5, 0),
                new google.maps.Point(0, 0));

		var marker = new google.maps.Marker({
	      position: latLng,
	      map: mMapa.map,
	      title: 'tu ubicación',
	    //  icon: markerImage
	  });



		//marker.setMap(mMapa.map);
		mMapa.bounds.extend(marker.position);

	},
	setLocation : function(lat,lng){
		MyMap.map.panTo(new google.maps.LatLng( lat, lng) )
		mMapa.setMapCookies(lat,lng);
	},
	onLocationFound : function(position){
		console.log("location found")
		var pos = position.latlng;
		mMapa.setLocation(pos.lat,pos.lng)
		gGeo.codeLatLng(pos.lat,pos.lng);
	},
	onLocationError : function(){
		console.log("drag location not found");
	},
	onLocationChange : function(event){
		var marker = event.target;  
        var result = marker.getLatLng();  
        gGeo.codeLatLng(result.lat, result.lng);
        mMapa.setMapCookies(result.lat, result.lng);
        mMapa.userLocation.openPopup();
	},
	autoLocate : function(){
		navigator.geolocation.getCurrentPosition(ctrl_mapa.routeProc, ctrl_mapa.routeErr);
	},
	fitBounds: function(){
		var bounds = new L.LatLngBounds(mMapa.marker);
		mMapa.map.fitBounds(bounds);
	},
	clearPins : function(){
		 for(i=0;i<mMapa.marker.length;i++) {
		    mMapa.map.removeLayer(mMapa.marker[i]); };
		    mMapa.marker = [];
	},
	addPins : function(data){

		
	//	mMapa.clearPins();
		for (var r = 0; r < data.length; r++) {
			var logoURL = data[r].BUSSINESS.LOGOTIPO;
			// COLOR			
			var latLng = new google.maps.LatLng(data[r].loc.lat,data[r].loc.lng)

			var Marker  = new google.maps.Marker({
			      position: latLng,
			      map: mMapa.map,
			  });

			//var  LamMarker = L.marker([data[r].loc.lat, data[r].loc.lng ], {icon: restIcon}).addTo(mMapa.map).bindPopup();

			Marker.setMap(mMapa.map);
			mMapa.bounds.extend(Marker.position);

        	mMapa.marker.push(Marker); 
		}
	},
	traceRoute : function(start,end){

		var _start 	= new google.maps.LatLng(start.lat, start.lng);
		var _end 	= new google.maps.LatLng(end.lat, end.lng);

		console.log(_start)
		console.log(_end)

		  var request = {
		    origin: _start,
		    destination: _end,
		    travelMode: google.maps.TravelMode.DRIVING
		  };

		directionsService = new google.maps.DirectionsService();
    	directionsDisplay = new google.maps.DirectionsRenderer();
    	directionsDisplay.setPanel(document.getElementById('directions-panel'));

    	var steps;
    	var pointList = [];
		 directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		      var distance=response.routes[0].legs[0].distance.text;
		      distanceOnmap.push(distance);
		     // console.log(response.routes[0].legs[0].duration.text);
		     // console.log(response.routes[0].legs[0].distance.text);
		     // console.log(response.routes[0].legs[0].steps);

		       directionResult = response;
               var myRoute = directionResult.routes[0].legs[0];

                for (var i = 0; i < myRoute.steps.length; i++) {
                var pathis = myRoute.steps[i].path;
	                for (var j = 0; j < pathis.length; j++) {

	                    var pointA =  new google.maps.LatLng(pathis[j].A, pathis[j].F)
	                    	                   // console.log(pathis[j].A +  " - " +  pathis[j].F)
	                 //  mMapa.bounds.extend(pointA.position);
	                    pointList.push(pointA);
	                };
           		};
           		if (selecrank==0) {
                selecrank = {'NOMBRE' : 'default','COLOR' : '1B75BB'};
	            };
	            	var Path = new google.maps.Polyline({
					    path: pointList,
					    geodesic: true,
					    strokeColor: '#FF0000',
					    strokeOpacity: 1.0,
					    strokeWeight: 1
					  });
					  Path.setMap(mMapa.map);
					
		    };
		  });
			}

}
// Google Geo Code Controller -------------------------------------
var gGeo = {
	oVars : {	
		direccion : "",
		dirParts : {},
		startGeo : {},
		finalGeo : {},
		geoTimer : {},
		inputBox : {}	 
	},
	directionsService  : {},
	directionsDisplay  : {},
	init: function(){
		gGeo.oVars.inputBox = $('#pac-input');
		var input = (document.getElementById('pac-input'));
		var searchBox =  new google.maps.places.SearchBox(input)

		gGeo.directionsService = new google.maps.DirectionsService();
    	gGeo.directionsDisplay = new google.maps.DirectionsRenderer();
		gGeo.directionsDisplay.setPanel(document.getElementById('directions-panel'));

		gGeo.getGeoCookies();
		if(gGeo.oVars.direccion!="") { gGeo.oVars.inputBox.val(gGeo.oVars.direccion) }

		$('#btnFindEnter').on('click', gGeo.triggerSearch);

	    gGeo.oVars.inputBox.keypress(function (e) {
	         var key = e.which;
	         if(key == 13)  {
	            gGeo.triggerSearch();
	            return false;  
	          }
	     });

	    google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                gGeo.codeLatLng(places[0].geometry.location.k,places[0].geometry.location.D);
                mMapa.setLocation(places[0].geometry.location.k,places[0].geometry.location.D)
                var address = '';
                if (places[0].address_components) {
                    address = [
                        (places[0].address_components[0] && places[0].address_components[0].short_name || ''),
                        (places[0].address_components[1] && places[0].address_components[1].short_name || ''),
                        (places[0].address_components[2] && places[0].address_components[2].short_name || '')
                    ].join(' ');
                }
        });
	},
	getGeoCookies : function(){
	    gGeo.oVars.direccion = utils.getCookie('direccion');
	},
	setGeoCookies : function(direccion){
		var d = new Date();
   		d.setTime(d.getTime() + (1*24*60*60*1000));
    	document.cookie="direccion="+ direccion +";expires="+d.toUTCString();
    	gGeo.oVars.direccion = direccion;
	},
	codeLatLng : function(lat,lng){
        gGeo.oVars.startGeo = new Date().getTime();
        var timeOn = (Math.abs(gGeo.oVars.finalGeo - gGeo.oVars.startGeo))
        if(!timeOn || timeOn>2000){
            gGeo.initLatLng(lat, lng);    
        } else {
            mMapa.userLocation.bindPopup('<div id="loaderGeo"><img src="../images/gif-load.gif" style="text-align:center;width:20px;height:20px;"></div>').openPopup();
            clearTimeout(gGeo.oVars.geoTimer);
            gGeo.oVars.geoTimer=setTimeout(function(){ gGeo.initLatLng(lat, lng)},2000);
        }
    },
    initLatLng : function(lat, lng) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                var parts = results[0].address_components
                   gGeo.oVars.dirParts = {
                   		numero 	: parts[0].long_name,
                   		calle	: parts[1].long_name,
                   		colonia : parts[2].long_name,
                   		ciudad  : parts[3].long_name,
                   		estado 	: parts[4].long_name,
                   		pais 	: parts[5].long_name,
                   		cp 		: parts[6].long_name,
                   }
                 
                   gGeo.setGeoCookies(results[0].formatted_address);
                   gGeo.oVars.inputBox.val(results[0].formatted_address);
                   gGeo.oVars.finalGeo = new Date().getTime();
                 // if(profileImage){
                //  mMapa.userLocation.bindPopup('<img id="fotito2" class=\"fb-photo img-polaroid\" src=\"https://' + profileImage  + '\">').openPopup();
                 //   }
                } else {
                   console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    },
    triggerSearch : function(){
        var input =(document.getElementById('pac-input'));
        google.maps.event.trigger( input, 'focus')
        google.maps.event.trigger( input, 'keydown', {keyCode:13})
    }


}