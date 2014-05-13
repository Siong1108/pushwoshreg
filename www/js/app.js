var app = {
// Application Constructor
    initialize: function() {
     alert('ini mulai');
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {alert('device ready liao');
        initPushwoosh();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id + 'aaaaaaaaaaaa');
}

};

// $(document).ready(function() { login() });
// $(window).on("apiReady", function() { login() });

// var pathNoImage = "images/no-image.png"

// function login() {
// var body = { email: "sugiarto.htf@gmail.com", password: "p@s5w0rddfs" };
// window.df.apis.user.login({ body:body }, function(logindata) {
// var session = new ApiKeyAuthorization("X-DreamFactory-Session-Token", logindata.session_id, "header");
// window.authorizations.add("X-DreamFactory-Session-Token", session); runApp();
// });
// }

// function runApp() {
// var localdata = {"countries":[], "cities":[], "malls":[]};

// window.df.apis.db.getRecords({table_name: "Mall", "related": "MallOpeningHours_by_mallID, MallServices_by_mallID"}, function(malldata) {
// localdata.malls = malldata.record;
// window.localStorage.setItem('localdata', JSON.stringify(localdata)); getCountryData(); getFavorite();

// if(navigator.geolocation) {
// var positionOptions = {
// enableHighAccuracy: true,
// frequency: 3000,
// timeout: 10 * 1000 // 10 seconds
// };

// navigator.geolocation.getCurrentPosition(function(position) {
// // var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
// alert(position.coords.latitude +', '+ position.coords.longitude);
// for(var idxMall = 0; idxMall < localdata["malls"].length; idxMall++) {
// var distance = Math.acos(Math.sin(localdata["malls"][idxMall].geoLat) * Math.sin(position.coords.latitude) +
// Math.cos(localdata["malls"][idxMall].geoLat) * Math.cos(position.coords.latitude) *
// Math.cos(position.coords.longitude - localdata["malls"][idxMall].geoLong)) * 6371;

// if(distance <= 50) {
// alert("You are in "+ localdata["malls"][idxMall].name +" area.");
// }
// }
// }, function(positionError) {
// alert("Error: " + positionError.message);
// }, positionOptions);
// }
// });

// window.df.apis.db.getRecords({table_name: "City", "related": "SubUrbs_by_cityID"}, function (citydata) {
// localdata.cities = citydata.record;
// });

// window.df.apis.db.getRecords({table_name: "Country"}, function (countrydata) {
// localdata.countries = countrydata.record;
// });

// }


// // To get and show the Country List: START!
// function getCountryData() { //alert('getCountryData');
// var localdata = JSON.parse(window.localStorage.getItem("localdata"));
// var countries = localdata["countries"];

// $('#countrylist').empty();
// $('#countrylist').on('singletap', 'li', function() { getCityData(this.id) });

// for(var idxCountry = 0; idxCountry < countries.length; idxCountry++) {
// var tmpcountry = '<img src='+ countries[idxCountry].image +' class="responsive">\
// <li role="button" class="comp" id="'+ countries[idxCountry].ID +'" data-goto="city">\
// <div><h3>'+ countries[idxCountry].name +'</h3><p>'+ countries[idxCountry].tagLine +'</p></div>\
// <aside><span class="counter" id="'+ countries[idxCountry].ID +'count"></span><span class="nav"></span></aside>\
// </li>';

// $('#countrylist').append(tmpcountry);

// var mallcount = 0;
// for(var idxMall = 0; idxMall < localdata.malls.length; idxMall++) {
// if(localdata.malls[idxMall].countryID == countries[idxCountry].ID) {
// mallcount++;
// }
// } $('#'+ countries[idxCountry].ID +'count').html(mallcount);
// }
// } // To get and show the Country List: END!


// PushWoosh push.js code

function registerPushwooshIOS() {
  var pushNotification = window.plugins.pushNotification;

  //push notifications handler
document.addEventListener('push-notification', function(event) {
var notification = event.notification;
navigator.notification.alert(notification.aps.alert);

//to view full push payload
navigator.notification.alert(JSON.stringify(notification));

//reset badges on icon
pushNotification.setApplicationIconBadgeNumber(0);
});

pushNotification.registerDevice({alert:true, badge:true, sound:true, pw_appid:"E0506-55D2A", appname:"Vmall"},
function(status) {
var deviceToken = status['deviceToken'];
console.warn('registerDevice: ' + deviceToken);
onPushwooshiOSInitialized(deviceToken);
},
function(status) {
console.warn('failed to register : ' + JSON.stringify(status));
navigator.notification.alert(JSON.stringify(['failed to register IOS', status]));
});

//reset badges on start
pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken)
{
var pushNotification = window.plugins.pushNotification;
//retrieve the tags for the device
pushNotification.getTags(function(tags) {
console.warn('tags for the device: ' + JSON.stringify(tags));
},
function(error) {
console.warn('get tags error: ' + JSON.stringify(error));
});

//start geo tracking. PWTrackSignificantLocationChanges - Uses GPS in foreground, Cell Triangulation in background.
pushNotification.startLocationTracking('PWTrackSignificantLocationChanges',
function() {
console.warn('Location Tracking Started');
});
}

function registerPushwooshAndroid() {

  var pushNotification = window.plugins.pushNotification;

//push notifications handler
document.addEventListener('push-notification', function(event) { alert('working');
var title = event.notification.title;
var userData = event.notification.userdata;

//dump custom data to the console if it exists
if(typeof(userData) != "undefined") {
alert('user data: ' + JSON.stringify(userData));
}

//and show alert
navigator.notification.alert('aaaaaaaaaaaaa');

//stopping geopushes
pushNotification.stopGeoPushes();
});

//projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
pushNotification.registerDevice({ projectid: "200402851784", appid : "E0506-55D2A" },
function(token) {
alert(token);
//callback when pushwoosh is ready
onPushwooshAndroidInitialized(token);
},
function(status) {
alert("failed to register Android: " + status);
alert(JSON.stringify(['failed to register Android ', status]));
});
 }

function onPushwooshAndroidInitialized(pushToken)
{
//output the token to the console
console.warn('push token: ' + pushToken);

var pushNotification = window.plugins.pushNotification;

pushNotification.getTags(function(tags) {
alert('tags for the device: ' + JSON.stringify(tags));
},
function(error) {
alert('get tags error: ' + JSON.stringify(error));
});


//set multi notificaiton mode
//pushNotification.setMultiNotificationMode();
//pushNotification.setEnableLED(true);

//set single notification mode
//pushNotification.setSingleNotificationMode();

//disable sound and vibration
//pushNotification.setSoundType(1);
//pushNotification.setVibrateType(1);

pushNotification.setLightScreenOnNotification(false);

//goal with count
//pushNotification.sendGoalAchieved({goal:'purchase', count:3});

//goal with no count
//pushNotification.sendGoalAchieved({goal:'registration'});

//setting list tags
//pushNotification.setTags({"MyTag":["hello", "world"]});

//settings tags
pushNotification.setTags({deviceName:"hello", deviceId:10},
function(status) {
alert('setTags success');
},
function(status) {
alert('setTags failed');
});

function geolocationSuccess(position) {
pushNotification.sendLocation({lat:position.coords.latitude, lon:position.coords.longitude},
function(status) {
alert('sendLocation success');
},
function(status) {
alert('sendLocation failed');
});
};

// onError Callback receives a PositionError object
//
function geolocationError(error) {
alert('code: ' + error.code + '\n' +
'message: ' + error.message + '\n');
}

function getCurrentPosition() {
navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
}

//greedy method to get user position every 3 second. works well for demo.
// setInterval(getCurrentPosition, 3000);

//this method just gives the position once
// navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);

//this method should track the user position as per Phonegap docs.
// navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });

//Pushwoosh Android specific method that cares for the battery
pushNotification.startGeoPushes();
}

 function initPushwoosh() {alert('123');
var pushNotification = window.plugins.pushNotification;


var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
        var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
        var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());

        if (isiDevice) {
            alert('<link rel="stylesheet" href="assets/css/chui-ios-3.5.4.css">');
        } else if (isAndroid) {
           {alert('android lip liao');
registerPushwooshAndroid();
pushNotification.onDeviceReady();
        } else if (isWindowsPhone) {
            registerPushwooshIOS();
pushNotification.onDeviceReady();
        } else {
            {alert('android lip liao');
registerPushwooshAndroid();
pushNotification.onDeviceReady();
        }


}

