
var deploy = "DEV"


if(window.StatusBar) {
  // org.apache.cordova.statusbar required
  StatusBar.styleDefault();
}



function handleClicks(e){
  
}


// DOM Ready =============================================================
function onDeviceReady(){


    $.support.cors = true;
   initApp();
}

$(document).ready(function() {



    if(deploy=="DEV"){
        initApp();
    } else {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
});

function initApp(){


   $.mobile.pageContainer = $('#container');
   $.mobile.defaultPageTransition = 'slide';
   //$.mobile.defaultHomeScroll = 0;
   $( "#pop1" ).popup();

   		mainC.init(ctrl_core.init)



$(document).on('focus', 'input, textarea', function() 
{
  $.mobile.activePage.find("div[data-role='footer']").hide();
});

$(document).on('blur', 'input, textarea', function() 
{
  $.mobile.activePage.find("div[data-role='footer']").show();
});

  $('.bButton').bind( "tap",function(){
      
              // history.go(0)
               //write your code here                 
               $.mobile.back()
          //window.history.back();
          
  })

  $('.hButton').bind( "tap",function(){
      $.mobile.changePage("#mainScreen")
  })

  try {
      //window.plugin.backgroundMode.setDefaults({text:"Trabajando en segundo plano", resume: false});
      //window.plugin.backgroundMode.enable();
    } catch (e){
      //alert(e)
    }


  
}


var bPos = {
  init : function(){

      backgroundGeolocation.configure(bPos.callbackFn, bPos.failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle : "C4U Promo",
        notificationText : "Activa",
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
        interval : 60000
    });

      backgroundGeolocation.start();

  },
  failureFn : function(error) {
        console.log('BackgroundGeolocation error');
  },
  callbackFn : function(location) {
        console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

        var item = {  ts      : utils.generateTS(),
                  id      : utils.generateUUID()};


        var params = {}
        params.dataB = location;
        params.dataB.userId = window.localStorage.getItem("userId")
        params.dataB.username = window.localStorage.getItem("username")
        params.dataB.clients = [item];
        params.dataB.estRCD = 1;
        dbC.query("/api/createPosition","POST",params,null)
       
        backgroundGeolocation.finish();
  }


}


var wPos = {
  
  maximumAge          : 300000,  // cache for 
  timeout             : 5000,
  maxDistance         : .05,
  timeVar             : "",
  refreshTime         : 60000,
  callback            : "",
  lastLat             : null,
  lastLng             : null,
  setInt              : {},

  startWP : function(callback){
      wPos.callback = callback;
      wPos.setInt = setInterval(wPos.getWp,wPos.refreshTime);
  },
  stopWP : function(){
    wPos.getWp();
    wPos.setInt.stopInterval();
  },
  getWp : function(){
      console.log("GETGGIN WP")
      var options = { maximumAge: wPos.maximumAge, timeout: wPos.timeout, enableHighAccuracy: true };
      var watchId = navigator.geolocation.getCurrentPosition(wPos.geolocationSuccess,
                                                        wPos.geolocationError,
                                                        options);
  },
  geolocationSuccess : function(position){

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var ts  = utils.generateTS();


        if(wPos.lastLat!=null){
           var dist =  wPos.gps_distance(wPos.lastLat,
            wPos.lastLng,
            lat,
            lng);

            if(dist>wPos.maxDistance){
            wPos.savePos(position);
             }

         }else{
            wPos.savePos(position);
         }
         

          wPos.lastLat = lat;
          wPos.lastLng = lng;
 
  },  
  savePos: function(data){

    var item = {  ts      : utils.generateTS(),
                  id      : utils.generateUUID()};


    var params = {}
    params.dataB = data;
    params.dataB.userId = window.localStorage.getItem("userId")
    params.dataB.username = window.localStorage.getItem("username")
    params.dataB.clients = [item];
    params.dataB.estRCD = 1;
    dbC.query("/api/createPosition","POST",params,wPos.positionRet)
  },
  positionRet : function(){

  },
  geolocationError : function(error){
    console.log(error)
  },
  gps_distance : function(lat1, lon1, lat2, lon2) {

    var R = 6371; // use 3959 for miles or 6371 for km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
  }

}


function getLastKnownLocation(callback,errorF,refresh){

  var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

  var errorF = errorF
  if(errorF==undefined) { errorF = function(){}}

    console.log(typeof localStorage.lastKnownPosition)
  console.log(localStorage.lastKnownPosition)
    console.log("COOKIE LOC")

    if(typeof localStorage.lastKnownPosition == "undefined" || refresh){
          navigator.geolocation.getCurrentPosition(
          function(position){
           var objPos = {
              coords : {
              latitude : position.coords.latitude,
              longitude : position.coords.longitude }
           }
              localStorage.lastKnownPosition = JSON.stringify(objPos);
              callback(position); 
          },errorF);
    }else{
        callback(JSON.parse(localStorage.lastKnownPosition)); 
    } 
}

//keytool -genkey -v -keystore expoina.keystore -alias expoina -keyalg RSA -keysize 2048 -validity 10000
//pabloneruda14


function openDeviceBrowser (externalLinkToOpen){  window.open(externalLinkToOpen, '_system', 'location=no');}


function onSuccess(location){
  console.log(location)
}

function onError(e){
  
}


