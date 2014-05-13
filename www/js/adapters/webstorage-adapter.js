var LocalStorageAdapter = function() {
	var country = [], city = [], suburb = [], mall = [];
	var status = false;

	this.initialize = function() {
		var deferred = $.Deferred();
		
		window.df.apis.db.getRecords({table_name: "Country"}, function (countrydata) {
			status = false;
			while(status == false) {
				country = countrydata.record;
				if(country == countrydata.record) { status = true; alert(JSON.stringify(country)); }
			}
		});

        window.df.apis.db.getRecords({table_name: "City"}, function (citydata) {
        	status = false;
        	while(status == false) {
        		city = citydata.record;
        		if(city == citydata.record) { status = true; alert(JSON.stringify(city)); }
        	}
        });

		window.df.apis.db.getRecords({table_name: "SubUrb"}, function (suburbdata) {
			status = false;
			while(status == false) {
				suburb = suburbdata.record;
				if(suburb == suburbdata.record) { status = true; alert(JSON.stringify(suburb)); }
			}
		});

		window.df.apis.db.getRecords({table_name: "Mall"}, function (malldata) { mall = malldata.record; });

        deferred.resolve();
        return deferred.promise();
	}

	this.getCountryData = function() {
		var deferred = $.Deferred();
		
		deferred.resolve(country);
		return deferred.promise();
	}

	this.getCityData = function(idcountry) {
		var deferred = $.Deferred();
		var citydata = [];

		for(var i = 0; i < city.length; i++) { if(city[i].cityountryID == idcountry) {
			citydata.push(city[i]);
		}}

		deferred.resolve(citydata);
		return deferred.promise();
	}

	this.getSubUrbData = function(idcity) {
		var deferred = $.Deferred();
		var suburbdata = [];

		for(var i = 0; i < suburb.length; i++) { if(suburb[i].cityID == idcity) {
			suburbdata.push(suburb[i]);
		}}

		deferred.resolve(suburbdata);
		return deferred.promise();
	}

	this.getMallInCountry = function(idcountry) {
		var deferred = $.Deferred();
		var mallcount = 0;

		for(var i = 0; i < mall.length; i++) { if(mall[i].countryID == idcountry) {
			mallcount++;
		}}

		deferred.resolve(mallcount);
		return deferred.promise();
	}

	this.getMallInCity = function(idcity) {
		var deferred = $.Deferred();
		var mallcount = 0;

		for(var i = 0; i < mall.length; i++) { if(mall[i].cityID == idcity) {
			mallcount++;
		}}

		deferred.resolve(mallcount);
		return deferred.promise();
	}

	this.getMallInSubUrb = function(idsuburb) {
		var deferred = $.Deferred();
		var mallcount = 0;

		for(var i = 0; i < mall.length; i++) { if(mall[i].subUrbID == idsuburb) {
			mallcount++;
		}}

		deferred.resolve(mallcount);
		return deferred.promise();
	}

	this.getMallData = function(idsuburb) {
		var deferred = $.Deferred();
		var malldata = [];

		for(var i = 0; i < mall.length; i++) { if(mall[i].subUrbID == idsuburb) {
			malldata.push(mall[i]);
		}}

		deferred.resolve(malldata);
		return deferred.promise();
	}

	this.getOpenData = function(idmall) {
		var deferred = $.Deferred();
		var open = [];

		window.df.apis.db.getRecords({
			table_name: "MallOpeningHours", "filter": "mallID="+ idmall
		}, function(opendata) { open = opendata.record; alert("ws :: "+ JSON.stringify(open)); });

		deferred.resolve([{"open": "hour"}]);
		return deferred.promise();
	}

	this.getServiceData = function(idmall) {
		var deferred = $.Deferred();
		var services = [];

		window.df.apis.db.getRecords({
			table_name: "MallServices", "filter": "mallID="+ idmall
		}, function(servicedata) { services = servicedata.record });

		deferred.resolve(services);
		return deferred.promise();
	}

	this.getEventData = function(idmall) {
		var deferred = $.Deferred();
		var events = [];

		window.df.apis.db.getRecords({
			table_name: "MallEvents", "filter": "mallID="+ idmall
		}, function(eventdata) { events = eventdata.record });

		deferred.resolve(events);
		return deferred.promise();
	}

	this.getTenantData = function(idmall) {
		var deferred = $.Deferred();
		var tenants = [];

		window.df.apis.db.getRecords({
			table_name: "Tenant", "filter": "mallID="+ idmall +"&&isActive=true"
		}, function(shopdata) { tenants = shopdata.record });

		deferred.resolve(tenants);
		return deferred.promise();
	}

	this.getProductData = function(idshop) {
		var deferred = $.Deferred();
		var products = [];
		
		window.df.apis.db.getRecords({
			table_name: "Products", "filter": "tenantID="+ idshop
		}, function(productdata) { products = productdata.record });

		deferred.resolve(products);
		return deferred.promise();
	}

	this.getPromoData = function(idshop) {
		var deferred = $.Deferred();
		var promos = [];

		window.df.apis.db.getRecords({
			table_name: "Promo", "filter": "tenantID="+ idshop
		}, function(promodata) { promos = promodata.record });

		deferred.resolve(promos);
		return deferred.promise();
	}
}