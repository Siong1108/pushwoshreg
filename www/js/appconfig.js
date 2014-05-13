var pathMallLogo = 'http://dfs.vmall.ws/files/vmall/mall/';
var pathMallImage = 'http://dfs.vmall.ws/files/vmall/mall/';
var pathShopLogo = 'http://dfs.vmall.ws/files/vmall/shops/';
var pathShopImage = 'http://dfs.vmall.ws/files/vmall/shops/';
var pathShopMap = 'http://dfs.vmall.ws/files/vmall/shops/';
var pathProductFull = 'assets/img/products/full/';
var pathProductThumb = 'assets/img/products/thumb/';
var pathServiceMap = 'http://dfs.vmall.ws/files/vmall/shops/';
var pathEventImage = 'http://dfs.vmall.ws/files/vmall/shops/';

function showMap(div, lat, lng, title, msg) {
	// Creating a LatLng object containing the coordinate for the center of the map
	var location = new google.maps.LatLng(lat, lng);

	// Creating an object literal containing the properties we want to pass to the map
	var option = {
		zoom: 16, // This number can be set to define the initial zoom level of the map
		center: location,
		mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
	};

	// Calling the constructor, thereby initializing the map 
	var map = new google.maps.Map(document.getElementById(div), option);

	// Define Marker properties
	var image = new google.maps.MarkerImage('assets/img/app/marker.png',
		// This marker is 129 pixels wide by 42 pixels tall.
		new google.maps.Size(129, 42),
		// The origin for this image is 0,0.
		new google.maps.Point(0,0),
		// The anchor for this image is the base of the flagpole at 18,42.
		new google.maps.Point(18, 24)
	);

	// Add Marker
	var marker1 = new google.maps.Marker({
		position: new google.maps.LatLng(lat,lng), 
		map: map,		
		icon: image // This path is the custom pin to be shown. Remove this line and the proceeding comma to use default pin
	});

	// Add listener for a click on the pin
	google.maps.event.addListener(marker1, 'click', function() {  
		infowindow1.open(map, marker1);  
	});
		
	// Add information window
	var infowindow1 = new google.maps.InfoWindow({  
		content:  '<div class="infomap"><strong>'+ title +'</strong><br/>'+ msg +'</div>'
	});
}
