window.app = {};

$(document).ready(function() { login() });
$(window).on("apiReady", function() { login() });

var pathNoImage = "images/no-image.png"

function login() {
    var body = { email: "sugiarto.htf@gmail.com", password: "p@s5w0rddfs" };
    window.df.apis.user.login({ body:body }, function(logindata) {
        var session = new ApiKeyAuthorization("X-DreamFactory-Session-Token", logindata.session_id, "header");
        window.authorizations.add("X-DreamFactory-Session-Token", session); runApp();
    });
}

function runApp() {
    var localdata = {"countries":[], "cities":[], "malls":[]};

    window.df.apis.db.getRecords({table_name: "Mall", "related": "MallOpeningHours_by_mallID, MallServices_by_mallID"}, function(malldata) {
        localdata.malls = malldata.record;
        window.localStorage.setItem('localdata', JSON.stringify(localdata)); getCountryData(); getFavorite();
        
        if(navigator.geolocation) {
            var positionOptions = {
                enableHighAccuracy: true,
                frequency: 3000,
                timeout: 10 * 1000 // 10 seconds
            };

            navigator.geolocation.getCurrentPosition(function(position) {
                // var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                alert(position.coords.latitude +', '+ position.coords.longitude);
                for(var idxMall = 0; idxMall < localdata["malls"].length; idxMall++) {
                    var distance = Math.acos(Math.sin(localdata["malls"][idxMall].geoLat) * Math.sin(position.coords.latitude) +
                                            Math.cos(localdata["malls"][idxMall].geoLat) * Math.cos(position.coords.latitude) *
                                            Math.cos(position.coords.longitude - localdata["malls"][idxMall].geoLong)) * 6371;
                    
                    if(distance <= 50) {
                        alert("You are in "+ localdata["malls"][idxMall].name +" area.");
                    }
                }
            }, function(positionError) {
                alert("Error: " + positionError.message);
            }, positionOptions);
        }
    });

    window.df.apis.db.getRecords({table_name: "City", "related": "SubUrbs_by_cityID"}, function (citydata) {
        localdata.cities = citydata.record;
    });

    window.df.apis.db.getRecords({table_name: "Country"}, function (countrydata) {
        localdata.countries = countrydata.record;
    });
}

function getFavorite() {
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var favmalls = localdata["malls"];
    var rand = Math.floor(Math.random() * (favmalls.length - 11));

    rand = Math.floor(Math.random() * (favmalls.length - 1));
    window.df.apis.db.getRecords({table_name: "Tenant", "fields": "name", "filter": "mallID="+ favmalls[rand].ID}, function(favShop) {
        $('#favmall').on('singletap', 'li', function(e) { getDetailData(this.id, this.value, 0); });
        for(var idxFavMall = rand; idxFavMall < rand + 10; idxFavMall++) {
            var tmpFavMall = '<li id="'+ favmalls[idxFavMall].ID +'" class="comp" role="button" data-goto="detail">\
                <div><h3>'+ favmalls[idxFavMall].name +'</div></h3>\
            </li>'; $('#favmall').append(tmpFavMall);
        }

        $('#favshop').on('singletap', 'li', function(e) { getShopData(this.id, this.value) });
        for(var idxFavShop = 0; idxFavShop < favShop.record.length; idxFavShop++) {
            var tmpFavShop = '<li id="'+ favShop.record[idxFavShop].ID +'" class="comp" role="button" data-goto="tenant">\
                <div><h3>'+ favShop.record[idxFavShop].name +'</div></h3>\
            </li>'; $('#favshop').append(tmpFavShop);
        }

        // Segmented's setting: START!
        var favoption = {
            id: 'favoption',
            labels: ['Malls', 'Shops'],
            selected: 0
        };

        var favResponse = function(e) { e.stopPropagation() };
        var favSegmented = $.UICreateSegmented(favoption);

        $('#favSegmented').empty();
        $('#favSegmented').append(favSegmented);
        $('.segmented').UISegmented({ callback: favResponse });
        $('.segmented').UIPanelToggle('#favDetail', function() { $.noop });
        // Segmented's setting: END!
    });
}

// To get and show the Country List: START!
function getCountryData() { //alert('getCountryData');
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var countries = localdata["countries"];

    $('#countrylist').empty();
    $('#countrylist').on('singletap', 'li', function() { getCityData(this.id) });

    for(var idxCountry = 0; idxCountry < countries.length; idxCountry++) {
        var tmpcountry = '<img src='+ countries[idxCountry].image +' class="responsive">\
        <li role="button" class="comp" id="'+ countries[idxCountry].ID +'" data-goto="city">\
            <div><h3>'+ countries[idxCountry].name +'</h3><p>'+ countries[idxCountry].tagLine +'</p></div>\
            <aside><span class="counter" id="'+ countries[idxCountry].ID +'count"></span><span class="nav"></span></aside>\
        </li>';

        $('#countrylist').append(tmpcountry);

        var mallcount = 0;
        for(var idxMall = 0; idxMall < localdata.malls.length; idxMall++) {
            if(localdata.malls[idxMall].countryID == countries[idxCountry].ID) {
                mallcount++;
            }
        } $('#'+ countries[idxCountry].ID +'count').html(mallcount);
    }
} // To get and show the Country List: END!

// To get and show the City List: START!
function getCityData(idcountry) {
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var cities = localdata["cities"];

    $('#citylist').empty();
    $('#citylist').on('singletap', 'li', function() { getSubUrbData(this.id) });

    for(var idxCountry = 0; idxCountry < localdata["countries"].length; idxCountry++) { if(localdata["countries"][idxCountry].ID == idcountry) {
        $('#cityhead').html(localdata["countries"][idxCountry].name); break;
    }}

    for(var idxCity = 0; idxCity < cities.length; idxCity++) { if(cities[idxCity].countryID == idcountry) {
        var tmpcity = '<li role="button" class="comp" id="'+ cities[idxCity].ID +'" data-goto="suburb">\
            <div><h3>'+ cities[idxCity].name +'</h3><p>'+ cities[idxCity].desc +'</p></div>\
            <aside><span class="counter" id="ct'+ cities[idxCity].ID +'count"></span><span class="nav"></span></aside>\
        </li>';

        $('#citylist').append(tmpcity);

        var mallcount = 0;
        for(var idxMall = 0; idxMall < localdata.malls.length; idxMall++) {
            if(localdata.malls[idxMall].cityID == cities[idxCity].ID) {
                mallcount++;
            }
        } $('#ct'+ cities[idxCity].ID +'count').html(mallcount);
    }}
} // To get and show the City List: END!

// To get and show the Sub Urb List: START!
function getSubUrbData(idcity) {
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var cities = localdata["cities"];

    for(var idxCity = 0; idxCity < cities.length; idxCity++) { if(cities[idxCity].ID == idcity) {
        $('#suburblist').empty();
        $('#suburbhead').html(cities[idxCity].name);
        $('#suburblist').on('singletap', 'li', function() { getMallData(this.id) });

        var suburbs = cities[idxCity].SubUrbs_by_cityID;
        for(var idxSubUrb = 0; idxSubUrb < suburbs.length; idxSubUrb++) {
            var tmpsuburb = '<li role="button" class="comp" id="'+ suburbs[idxSubUrb].ID +'" data-goto="malls">\
                <div><h3>'+ suburbs[idxSubUrb].name +'</h3></div>\
                <aside><span class="counter" id="su'+ suburbs[idxSubUrb].ID +'count"></span><span class="nav"></span></aside>\
            </li>';

            $('#suburblist').append(tmpsuburb);

            var mallcount = 0;
            for(var idxMall = 0; idxMall < localdata.malls.length; idxMall++) {
                if(localdata.malls[idxMall].subUrbID == suburbs[idxSubUrb].ID) {
                    mallcount++;
                }
            } $('#su'+ suburbs[idxSubUrb].ID +'count').html(mallcount);
        } break;
    }}
} // To get and show the Sub Urb List: END!

// To get and show the Mall List: START!
function getMallData(idsuburb) {
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var malls = localdata["malls"];

    $('#malllist').empty();
    $('#malllist').on('singletap', 'li', function(e) { if(e.handled !== true) {
        if(this.value > 4) getDetailData(this.id, 4, this.value);
        else getDetailData(this.id, this.value, 0);
        e.handled = true;
    }});

    window.df.apis.db.getRecords({
        table_name: "Tenant", "fields": "ID, mallID", "filter": "isActive=true"
    }, function(shopdata) {
        $('#malllist').empty();
        for(var idxMall = 0; idxMall < malls.length; idxMall++) { if(malls[idxMall].subUrbID == idsuburb) { var thismall = malls[idxMall];
            for(var idxCity = 0; idxCity < localdata["cities"].length; idxCity++) { if(localdata["cities"][idxCity].ID == thismall.cityID) {
                var xSubUrb = localdata["cities"][idxCity].SubUrbs_by_cityID;
                for(var idxSubUrb = 0; idxSubUrb < xSubUrb.length; idxSubUrb++) { if(xSubUrb[idxSubUrb].ID == idsuburb) {
                    $("#mallhead").html(xSubUrb[idxSubUrb].name); break;
                }} break;
            }}

            var pathImage = pathMallLogo + thismall.logo; if(thismall.logo == 'no-image') { pathImage = pathNoImage }
            var tmpmall = '<img src="'+ pathImage +'" alt="'+ thismall.name +'" class="responsive">\
            <li class="comp" id="'+ thismall.ID +'" data-goto="detail">\
                <div>\
                    <h3>'+ thismall.name +'</h3><h4>'+ thismall.tagLine +'</h4><br>\
                    <div><ul id="mall-quicklinks">\
                        <li role="button" id="'+ thismall.ID +'" value="3"><i class="fa fa-lg fa-map-marker"></i></li>\
                        <li role="button" id="'+ thismall.ID +'" value="2"><i class="fa fa-lg fa-calendar"></i></li>\
                        <li role="button" id="'+ thismall.ID +'" value="0"><i class="fa fa-lg fa-phone"></i></li>\
                        <li role="button" id="'+ thismall.ID +'" value="7"><i class="fa fa-lg fa-ticket" id="'+ thismall.ID +'sale"></i></li>\
                        <li role="button" id="'+ thismall.ID +'" value="8"><i class="fa fa-lg fa-certificate" id="'+ thismall.ID +'disc"></i></li>\
                        <li role="button" id="'+ thismall.ID +'" value="9"><i class="fa fa-lg fa-gift" id="'+ thismall.ID +'new"></i></li>\
                    </ul></div>\
                </div><aside><span class="counter" id="m'+ thismall.ID +'count"></span><span class="nav"></span></aside>\
            </li>';

            $('#malllist').append(tmpmall);

            var shopcount = 0;
            for(var idxShop = 0; idxShop < shopdata.record.length; idxShop++) {
                if(shopdata.record[idxShop].mallID == thismall.ID) { shopcount++ }
            } $('#m'+ thismall.ID +'count').html(shopcount);

            if(thismall.cNewProduct > 0) $('#' + thismall.ID + 'new').attr('data-badge', thismall.cNewProduct);
            if(thismall.cSale > 0) $('#' + thismall.ID + 'sale').attr('data-badge', thismall.cSale);
            if(thismall.cDisc > 0) $('#' + thismall.ID + 'disc').attr('data-badge', thismall.cDisc);
        }}
    });
} // To get and show the Mall List: END!

// To get and show the choosen Mall's detail: START!
function getDetailData(idmall, choosentab, filtershop) {
    var localdata = JSON.parse(window.localStorage.getItem("localdata"));
    var malls = localdata["malls"];

    for(var idxMall = 0; idxMall < malls.length; idxMall++) { if(malls[idxMall].ID == idmall) {
        var thismall = malls[idxMall];
        $('#detailhead').html(thismall.name);
        $('#shops').empty(); $('#services').empty(); $('#events').empty(); $('#locmap').empty(); $('#about').empty();

        window.df.apis.db.getRecords({
            table_name: "Mall",
            "fields": "ID",
            "ids": idmall,
            "related": "Tenants_by_mallID, MallEvents_by_mallID"
        }, function(malldata) {
            // Segmented of Mall About: START!
            var pathImage = pathMallLogo + malls[idxMall].image; if(malls[idxMall].image == 'no-image') { pathImage = pathNoImage }
            var tmpabout = '<li>\
                <div><img src="'+ pathImage +'" alt="'+ thismall.name +'" class="responsive"></div>\
                <ul class="info-tabs">\
                    <li><a href="'+ thismall.website +'">'+ thismall.name +'</a><span>Website</span></li>\
                    <li><a href="tel:+'+ thismall.phone +'">'+ thismall.phone +'</a><span>Phone</span></li>\
                    <li><a href="mailto:'+ thismall.email +'">Email Us</a><span>Email</span></li>\
                </ul>\
                <p>'+ thismall.about +'</p>\
                <h5>Opening Hours</h5>\
                <dl id="openhour"></dl>\
            </div>'; $('#about').html(tmpabout);

            for(var idxOpen = 0; idxOpen < thismall.MallOpeningHours_by_mallID.length; idxOpen++) {
                var openhour = thismall.MallOpeningHours_by_mallID[idxOpen];
                var tmpopen = '<dt>'+ openhour.openDay +'</dt><dd>'+ openhour.openHour +' - '+ openhour.closeHour +'</dd>';
                $('#openhour').append(tmpopen);
            } // Segmented of Mall About: END!

            // Segmented of Service: START!
            for(var idxService = 0; idxService < thismall.MallServices_by_mallID.length; idxService++) {
                var thisservice = thismall.MallServices_by_mallID[idxService];
                var pathImage = pathServiceMap + thismall.ID +'/'+ thisservice.map; if(thisservice.map == 'no-image') { pathImage = pathNoImage }
                var tmpservice = '<li class="comp">\
                    <div>\
                        <h3>'+ thisservice.name +'</h3>\
                        <p>'+ thisservice.desc.substring(0, 140) +'</p>\
                        <ul id="'+ thisservice.ID +'detail" class="info-tabs">\
                            <li value="1" id="'+ thisservice.ID +'"><a href="javascript:void(0)">More Info</a></li>\
                            <li value="2" id="'+ thisservice.ID +'"><a href="javascript:void(0)">Location</a></li>\
                            <li>'+ thisservice.floor +'</li>\
                        </ul>\
                    </div>\
                </li>';

                $('#services').append(tmpservice);
                $('#'+ thisservice.ID +'detail').on('singletap', 'li', function() {
                    if(this.value == '1') {
                        $.UIPopup({
                            title: thisservice.name,
                            message: thisservice.desc,
                            cancelButton: 'X'
                        });
                    } else if(this.value == '2') {
                        $.UIPopup({
                            message: '<img src="'+ pathImage +'" />',
                            cancelButton: 'X'
                        });
                    }
                });
            } // Segmented of Service: END!

            // Segmented of Event: START!
            var mallevents = malldata.record[0].MallEvents_by_mallID;
            $('#events').on('singletap', 'li', function() { getEventData(this.id) });

            for(var idxEvent = 0; idxEvent < mallevents.length; idxEvent++) {
                var thisevent = mallevents[idxEvent];
                var tmpevent = '<li class="comp" id="'+ thisevent.ID +'" data-goto="event">\
                    <div>\
                        <h3>'+ thisevent.name +'</h3>\
                        <h4>'+ thisevent.startDate +' - '+ thisevent.endDate +'</h4>\
                        <p>'+ thisevent.desc.substring(0, 140) +'...</p>\
                    </div><aside><span class="nav"></span></aside>\
                </li>'; $('#events').append(tmpevent);
            } // Segmented of Event: END!

            var tmplocation = '<li class="comp"><div id="mallmaps"></div></li>';
            $('#locmap').html(tmplocation);
            showMap('mallmaps', thismall.geoLat, thismall.geoLong, thismall.name, thismall.address +' '+ thismall.postCode);

            // Segmented of Shop/Tenant: START!
            var mallshops = malldata.record[0].Tenants_by_mallID;
            $('#shops').on('singletap', 'li', function(e) { if(e.handled !== true) { getShopData(this.id, this.value); e.handled = true; }});

            for(var idxShop = 0; idxShop < mallshops.length; idxShop++) {
                var shop = mallshops[idxShop];
                var isshow = false;

                if(filtershop == 0) {
                    isshow = true;
                } else {
                    if(filtershop == 7 && shop.cSale > 0) { isshow = true }
                    else if(filtershop == 8 && shop.cDisc > 0) { isshow = true }
                    else if(filtershop == 9 && shop.cNewProduct > 0) { isshow = true }
                }

                if(isshow) {
                    var pathImage = pathShopLogo + shop.mallID +'/'+ shop.logo; if(shop.logo == 'no-image') { pathImage = pathNoImage }
                    var tmpshop = '<li class="comp" id="'+ shop.ID +'" data-goto="tenant">\
                        <aside><img src="'+ pathImage +'" /></aside>\
                        <div>\
                            <h3>'+ shop.name +'</h3><br>\
                            <p><ul id="mall-quicklinks">\
                                <li role="button" id="'+ shop.ID +'" value="2"><i class="fa fa-lg fa-ticket" id="'+ shop.ID +'sale"></i></li>\
                                <li role="button" id="'+ shop.ID +'" value="2"><i class="fa fa-lg fa-certificate" id="'+ shop.ID +'disc"></i></li>\
                                <li role="button" id="'+ shop.ID +'" value="1"><i class="fa fa-lg fa-gift" id="'+ shop.ID +'new"></i></li>\
                                <li role="button" id="'+ shop.ID +'" value="0"><i class="fa fa-lg fa-heart"></i></li>\
                            </ul></p>\
                        </div><aside><span class="nav"></span></aside>\
                    </li>'; $('#shops').append(tmpshop);

                    if(shop.cNewProduct > 0) $('#' + shop.ID + 'new').attr('data-badge', shop.cNewProduct);
                    if(shop.cSale > 0) $('#' + shop.ID + 'sale').attr('data-badge', shop.cSale);
                    if(shop.cDisc > 0) $('#' + shop.ID + 'disc').attr('data-badge', shop.cDisc);
                }
            } // Segmented of Shop/Tenant: END!

            // Segmented's setting: START!
            var malloption = {
                id: 'malloption',
                labels: ['Shops', 'Services', 'Events', 'Location', 'About'],
                selected: choosentab
            };

            var mallResponse = function(e) { e.stopPropagation() };
            var mallSegmented = $.UICreateSegmented(malloption);

            $('#mallSegmented').empty();
            $('#mallSegmented').append(mallSegmented);
            $('.segmented').UISegmented({ callback: mallResponse });
            $('.segmented').UIPanelToggle('#mallDetail', function() { $.noop });
            // Segmented's setting: END!
        }); break;
    }}
} // To get and show the choosen Mall's detail: END!

// To get and show the choosen Shop's detail: START!
function getShopData(idshop, choosentab) {
    $('#products').empty(); $('#items').empty(); $('#promos').empty(); $('#locmap').empty(); $('#about').empty();

    window.df.apis.db.getRecords({
        table_name: "Tenant", "ids": idshop, "related": "TenantOpeningHours_by_tenantID, Promos_by_tenantID, Products_by_tenantID"
    }, function(shopdata) {
        var thisshop = shopdata.record[0];
        $('#tenanthead').html(thisshop.name);

        var shopproducts = thisshop.Products_by_tenantID;
        if(shopproducts.length > 0) {
            for(var idxProduct = 0; idxProduct < shopproducts.length; idxProduct++) {
                var thisproduct = shopproducts[idxProduct];
                var tmpthumb = '<li class="comp" id="f'+ thisproduct.ID +'">\
                <aside>\
                <!-- <img src="'+ pathProductThumb + thisproduct.image +'" class="productimg"> --> \
                <a href="'+ pathProductFull + thisproduct.image +'" data-imagelightbox="d">\
                <img src="'+ pathProductThumb + thisproduct.image +'" alt="'+ thisproduct.name +' @'+ thisproduct.price +'" class="productimg" />\
                </a>\
                </aside>\
                <div>\
                <h3>'+ thisproduct.name +'</h3>\
                <p>'+ thisproduct.desc +'</p>\
                <p><strong>'+ thisproduct.price +'</strong>\
                </div>\
                </li>';
                var tmpfull = '<li class="comp" id="f'+ thisproduct.ID +'">\
                    <p>'+ thisproduct.name +'</p><img src="'+ pathProductFull + thisproduct.image +'" alt="'+ thisproduct.name +'" />\
                    <p>'+ thisproduct.desc +'</p><p><strong>'+ thisproduct.price +'</strong></p>\
                </li>';

                $('#products').append(tmpthumb);
                $('#fullproduct').append(tmpfull);
            }

            $('#fullproduct li').css('display', 'none').removeClass('clicked');
            $('#fullproduct li#f'+ shopproducts[0].ID).removeAttr('style').addClass('clicked');

            $('#thumbproduct').owlCarousel({
                items : 3, itemsMobile : [300, 30]
            });

            $('.link').on('click', function() {
                if(!$(this).hasClass('clicked')) {
                    $('#fullproduct li').css('display', 'none').removeClass('clicked');
                    $('#fullproduct li#'+ this.id).removeAttr('style').addClass('clicked');
                }
            });
        } else {
            $('#products').html("<li class='comp'>There are currently no products for this Shop</li>");
        }

        var shopcollection = thisshop.Products_by_tenantID;
        if(shopcollection.length > 0) {
            var tmpitems = '';

            $('#items').append(tmpitems);
            for(var idxNewItem = 0; idxNewItem < shopcollection.length; idxNewItem++) { if(shopcollection[idxNewItem].isNew) {
                var thiscollection = shopcollection[idxNewItem];
                var tmpitem = '<li class="comp">\
                <aside>\
                <a href="'+ pathProductFull + thiscollection.image +'" data-imagelightbox="d">\
                    <img src="'+ pathProductThumb + thiscollection.image +'" alt="'+ thiscollection.name +' @'+ thiscollection.price +'" class="productimg" />\
                </a>\
                </aside>\
                <div>\
                <h3>'+ thiscollection.name +'</h3>\
                <p>'+ thiscollection.desc +'</p>\
                <p><strong>'+ thiscollection.price +'</strong>\
                </div>\
                </li>';

                $('#items').append(tmpitem);
            }}

            // Image Light Box: START!
            var activityOn = function() { $( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' ); };
            var activityOff = function() { $( '#imagelightbox-loading' ).remove(); };
            var captionOn = function() {
                var caption = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' );
                if(caption.length > 0) $( '<div id="imagelightbox-caption">' + caption + '</div>' ).appendTo( 'body' );
            };
            var captionOff = function() { $( '#imagelightbox-caption' ).remove(); };

            $( 'a[data-imagelightbox="d"]' ).imageLightbox({
                onLoadStart: function() { captionOff(); activityOn(); },
                onLoadEnd:   function() { captionOn(); activityOff(); },
                onEnd:       function() { captionOff(); activityOff(); }
            });
            // Image Light Box: END!
        } else {
            $('#items').html('<li class="comp">There are no new collections at this time</li>');
        }

        var shoppromos = thisshop.Promos_by_tenantID;
        if(shoppromos.length > 0) {
            for(var idxPromo = 0; idxPromo < shoppromos.length; idxPromo++) {
                var thispromo = shoppromos[idxPromo];
                var tmppromo = '<li class="comp"><div>\
                    <h3>'+ thispromo.name +'</h3>\
                    <h4>'+ thispromo.startDate +' - '+ thispromo.endDate +'</h4>\
                    <p>'+ thispromo.desc +'</p>\
                </div></li>';

                $('#promos').append(tmppromo);
            }
        } else {
            $('#promos').html('<li class="comp">There are currently no promotions</li>');
        }

        var pathImage = pathShopMap + thisshop.mallID +'/'+ thisshop.map; if(thisshop.map == 'no-image') { pathImage = pathNoImage }
        var tmplocation = '<li class="comp"><img src="'+ pathImage +'" class="responsive"/></li>';
        $('#tlocmap').html(tmplocation);

        var pathImage = pathShopImage + thisshop.mallID +'/'+ thisshop.image; if(thisshop.image == 'no-image') { pathImage = pathNoImage }
        var tmpabout = '<li>\
            <div>\
                <img class="responsive" src="'+ pathImage +'" title="'+ thisshop.name +'" />\
            </div>\
            <ul class="info-tabs">\
            <li><a href="'+ thisshop.website +'">'+ thisshop.name +'</a><span>Website</span></li>\
            <li><a href="tel:'+ thisshop.phone +'">'+ thisshop.phone +'</a><span>Phone</span></li>\
            <li><a href="mailto:'+ thisshop.email +'">Email Us</a><span>Email</span></li>\
            </ul>\
            <p>'+ thisshop.about +'</p>\
        </li>';

        $('#tabout').html(tmpabout);

        // Segmented's setting: START!
        var shopoption = {
            id: 'shopoption',
            labels: ['About', 'Products', 'Collection', 'Promo', 'Location'],
            selected: choosentab
        };

        var shopResponse = function(e) { e.stopPropagation(); };
        var shopSegmented = $.UICreateSegmented(shopoption);

        $('#shopSegmented').empty();
        $('#shopSegmented').append(shopSegmented);
        $('.segmented').UISegmented({ callback: shopResponse });
        $('.segmented').UIPanelToggle('#tenantDetail', function() { $.noop; });
        // Segmented's setting: END!
    });
} // To get and show the choosen Shop's detail: END!

// To get and show the choosen Event's detail: START!
function getEventData(idevent) {
    $('eventDetail').empty();

    window.df.apis.db.getRecords({
        table_name: "MallEvents", "ids": idevent, "related": "EventsProgs_by_mallEventID"
    }, function(eventdata) {
        var mallevent = eventdata.record[0];
        var pathImage = pathEventImage + mallevent.mallID +'/'+ mallevent.image; if(mallevent.image == 'no-image') { pathImage = pathNoImage }
        var tmpevent = '<ul class="list"><li>\
            <h3>'+ mallevent.name +'</h3>\
            <h4>Start Date: '+ mallevent.startDate +'<br/>End Date: '+ mallevent.endDate +'</h4>\
            <img src="'+ pathEventImage + mallevent.image +'" /><p>'+ mallevent.desc +'</p>\
            <p><strong>Event Program</strong></p><ul class="list" id="program"></ul>\
            <p>Contact Person: '+ mallevent.contactPerson +'</p>\
            <p>Phone Number: '+ mallevent.phone +'</p>\
        </li></ul>';

        $('#eventDetail').html(tmpevent);
        for(var idxProg = 0; idxProg < mallevent.EventsProgs_by_mallEventID.length; idxProg++) {
            var program = mallevent.EventsProgs_by_mallEventID[idxProg];
            var tmpprogram= '<li>'+ program.startTime +' - '+ program.endTime +' : '+ program.name +'</li>';
            $('#program').append(tmpprogram);
        }
    });
}  // To get and show the choosen Event's detail: END!
