/*
* storeLocator v1.4.9 - jQuery Google Maps Store Locator Plugin
* (c) Copyright 2013, Bjorn Holine (http://www.bjornblog.com)
* Released under the MIT license
* Distance calculation function by Chris Pietschmann: http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx
*/

(function($){
$.fn.storeLocator = function(options){

  //Do not change these settings in this file - settings should be overridden in the plugin call
	var settings = $.extend( {
		'mapDiv': 'map',
		'listDiv': '.bh-storelocator-loc-list',
		'formContainerDiv': '.bh-storelocator-form-container',
		'formID': 'user-location',
		'inputID': 'address',
		'regionID': 'region',
		'mapSettings': {
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		'pinColor': 'fe7569',
		'pinTextColor': '000000',
		'lengthUnit': 'm',
		'storeLimit': 26,
		'distanceAlert': 60,
		'dataType': 'xml',
		'dataLocation': 'data/locations.xml',
		'xmlElement': 'marker',
		'listColor1': 'ffffff',
		'listColor2': 'eeeeee',
		'originMarker': false,
		'originpinColor': 'blue',
		'bounceMarker': true,
		'slideMap': true,
		'modalWindow': false,
		'overlayDiv': '.bh-storelocator-overlay',
		'modalWindowDiv': '.bh-storelocator-modal-window',
		'modalContentDiv': '.bh-storelocator-modal-content',
		'modalCloseIconDiv': '.bh-storelocator-modal-close-icon',
		'defaultLoc': false,
		'defaultLat': '',
		'defaultLng': '',
		'autoGeocode': false,
		'maxDistance': false,
		'maxDistanceID': 'maxdistance',
		'fullMapStart': false,
		'noForm': false,
		'loading': false,
		'loadingDiv': 'bh-storelocator-loading',
		'featuredLocations': false,
		'infowindowTemplatePath': 'templates/infowindow-description.html',
		'listTemplatePath': 'templates/location-list-description.html',
		'KMLinfowindowTemplatePath': 'templates/kml-infowindow-description.html',
		'KMLlistTemplatePath': 'templates/kml-location-list-description.html',
		'listTemplateID': null,
		'infowindowTemplateID': null,
		'taxonomyFilters': null,
		'callbackBeforeSend': null,
		'callbackComplete': null,
		'callbackSuccess': null,
		'callbackModalOpen': null,
		'callbackModalClose': null,
		'jsonpCallback': null,
		//Language options
		'geocodeErrorAlert': 'Geocode was not successful for the following reason: ',
		'addressErrorAlert' : 'Unable to find address',
		'autoGeocodeErrorAlert': 'Automatic location detection failed. Please fill in your address or zip code.',
		'distanceErrorAlert': 'Unfortunately, our closest location is more than ',
		'mileLang': 'mile',
		'milesLang': 'miles',
		'kilometerLang': 'kilometer',
		'kilometersLang': 'kilometers'
  }, options);

  return this.each(function(){

  var $this = $(this);
  var listTemplate, infowindowTemplate, dataTypeRead, originalData, originalZoom;

	//KML is read as XML
	if (settings.dataType === 'kml') {
		dataTypeRead = 'xml';
	}
	else {
		dataTypeRead = settings.dataType;
	}

	/**
	 * Changing AJAX call to this function. TODO: Add old callbacks, maybe switch to when/then
	 */
	function getData(){
		var d = $.Deferred();

		$.ajax({
			type: 'GET',
			url: settings.dataLocation + (settings.dataType === 'jsonp' ? (settings.dataLocation.match(/\?/) ? '&' : '?') + 'callback=?' : ''),
			dataType: dataTypeRead,
			jsonpCallback: (settings.dataType === 'jsonp' ? settings.jsonpCallback : null)
		}).done(function(p){
			d.resolve(p);
		}).fail(d.reject);
		return d.promise();
	}

	var originalDataRequest = getData();

	//Save this separately so we can avoid multiple AJAX requests
	originalDataRequest.done(function(data){
		originalData = data;
	});

	//Save the original zoom setting so it can be retrieved if taxonomy filtering resets it
	originalZoom = settings.mapSettings.zoom;

	/**
	 * Load the external template files first
	 */
	//Get the KML templates
	if(settings.dataType === 'kml' && settings.listTemplateID === null && settings.infowindowTemplateID === null){
		//Try loading the external template files
		$.when(
			//KML infowindows
			$.get(settings.KMLinfowindowTemplatePath, function(template){
				var source = template;
				infowindowTemplate = Handlebars.compile(source);
			}),

			//KML locations list
			$.get(settings.KMLlistTemplatePath, function(template){
				var source = template;
				listTemplate = Handlebars.compile(source);
			})

		).then(function(){
			//Continue to the main script if templates are loaded successfully
			locator();

		}, function(){
			//KML templates not loaded - you can add a console.log here to see if your templates are failing

		});
	}
	//Handle script tag template method
	else if(settings.listTemplateID !== null && settings.infowindowTemplateID !== null){
		//TODO: Test this
		//Infowindows
		infowindowTemplate = Handlebars.compile($(settings.infowindowTemplateID).html());

		//Locations list
		listTemplate = Handlebars.compile($(settings.listTemplateID).html());

		//Continue to the main script
		locator();
	}
	//Get the JSON/XML templates
	else{
		//Try loading the external template files
		$.when(
			//Infowindows
			$.get(settings.infowindowTemplatePath, function(template){
				var source = template;
				infowindowTemplate = Handlebars.compile(source);
			}),

			//Locations list
			$.get(settings.listTemplatePath, function(template){
				var source = template;
				listTemplate = Handlebars.compile(source);
			})

		).then(function(){
			//Continue to the main script if templates are loaded successfully
			locator();

		}, function(){
			//JSON/XML templates not loaded - you can add a console.log here to see if your templates are failing

		});
	}

	/**
	 * Primary locator script runs after the templates are loaded
	 */
  function locator(){

  var userinput, olat, olng, marker, letter, storenum;
  var locationset = [];
  var featuredset = [];
  var normalset = [];
  var markers = [];
	var filters = {};
  var prefix = 'storeLocator';

	/**
	 * Reset function
	 */
  function reset(){
    locationset = [];
    featuredset = [];
    normalset = [];
    markers = [];
    $(document).off('click.'+prefix, settings.listDiv + ' li');
  }

	/**
	 * Count the selected filters
	 */
	function countFilters(){
		//TODO: Maybe check for empty object here first
		var filterCount = 0;

		for(var key in filters){
			filterCount += filters[key].length;
		}

		return filterCount;
	}

	/**
	 * Check for existing filter selections
	 */
	function checkFilters(){
		$.each(settings.taxonomyFilters,function(k, v){
			//Find the existing checked boxes for each checkbox filter
			$(v + ' input[type=checkbox]').each(function(){
				if($(this).prop('checked')){
					var filterVal = $(this).attr('id');

					//Only add the taxonomy id if it doesn't already exist
					if(filters[k].indexOf(filterVal) === -1){
						filters[k].push(filterVal);
					}
				}
			});

			//Find the existing selected value for each select filter
			$(v + ' select').each(function(){
				var filterVal = $(this).attr('id');

				//Only add the taxonomy id if it doesn't already exist
				if(filters[k].indexOf(filterVal) === -1){
					filters[k].push(filterVal);
				}
			});
		});
	}

	/**
	 * Get the filter key from the taxonomyFilter setting
	 *
	 * @param filterContainer {string} ID of the changed filter's container
	 */
	function getFilterKey(filterContainer){
		for(var key in settings.taxonomyFilters){
			if(settings.taxonomyFilters.hasOwnProperty(key)){
				for(var i = 0; i< settings.taxonomyFilters[key].length; i++){
					if(settings.taxonomyFilters[key] === filterContainer){
						return key;
					}
				}
			}
		}
	}

	//Taxonomy filtering
	if(settings.taxonomyFilters !== null){

		//Set up the filters
		$.each(settings.taxonomyFilters,function(k){
			filters[k] = [];
		});

		//Handle filter updates
		$('.bh-storelocator-filters-container').on('change.'+prefix, 'input, select', function(e){
			e.stopPropagation();

			var filterId, filterContainer, filterKey;

			//Handle checkbox filters
			if($(this).is('input[type="checkbox"]')){
				//First check for existing selections
				checkFilters();

				filterId = $(this).val();
				filterContainer = $(this).closest('.bh-storelocator-filters').attr('id');
				filterKey = getFilterKey(filterContainer);

				if(filterKey){
					//Add or remove filters based on checkbox values
					if($(this).prop('checked')){
						//Add ids to the filter arrays as they are checked
						filters[filterKey].push(filterId);
						if($('#'+settings.mapDiv).hasClass('bh-storelocator-map-open') === true){
							reset();
							if((olat) && (olng)){
								settings.mapSettings.zoom = 0;
								begin_mapping();
							}
							else{
								mapping(originalData);
							}
						}
					}
					else {
						//Remove ids from the filter arrays as they are unchecked
						var filterIndex = filters[filterKey].indexOf(filterId);
						if(filterIndex > -1){
							filters[filterKey].splice(filterIndex, 1);
							if($('#'+settings.mapDiv).hasClass('bh-storelocator-map-open') === true){
								reset();
								if((olat) && (olng)){
									if(countFilters() === 0){
										settings.mapSettings.zoom = originalZoom;
									}
									else{
										settings.mapSettings.zoom = 0;
									}
									begin_mapping();
								}
								else {
									mapping(originalData);
								}
							}
						}
					}
				}
			}
			//Handle select filters
			else if($(this).is('select')){
				//First check for existing selections
				checkFilters();

				filterId = $(this).val();
				filterContainer = $(this).closest('.bh-storelocator-filters').attr('id');
				filterKey = getFilterKey(filterContainer);

				//Check for blank filter on select since default val could be empty
				if(filterId){
					if(filterKey){
						filters[filterKey] = [filterId];
						if($('#'+settings.mapDiv).hasClass('bh-storelocator-map-open') === true){
							reset();
							if((olat) && (olng)){
								settings.mapSettings.zoom = 0;
								begin_mapping();
							}
							else{
								mapping(originalData);
							}
						}
					}
				}
				//Reset if the default option is selected
				else{
					if(filterKey){
						filters[filterKey] = [];
					}
					reset();
					if((olat) && (olng)){
						settings.mapSettings.zoom = originalZoom;
						begin_mapping();
					}
					else{
						mapping(originalData);
					}
				}
			}
		});
	}

  //Add modal window divs if set
  if(settings.modalWindow === true){
    $this.wrap('<div class="' + settings.overlayDiv + '"><div class="' + settings.modalWindowDiv + '"><div class="' + settings.modalContentDiv + '">');
    $('.' + settings.modalWindowDiv).prepend('<div class="' + settings.modalCloseIconDiv + '"><\/div>');
    $('.' + settings.overlayDiv).hide();
  }

  if(settings.slideMap === true){
    //Let's hide the map container to begin
    $this.hide();
  }

  //Calculate geocode distance functions - you could use Google's distance service instead
  var GeoCodeCalc = {};
  if(settings.lengthUnit === 'km'){
    //Kilometers
    GeoCodeCalc.EarthRadius = 6367.0;
  }
  else{
      //Default is miles
      GeoCodeCalc.EarthRadius = 3956.0;
  }
  GeoCodeCalc.ToRadian = function(v){ return v * (Math.PI / 180); };
  GeoCodeCalc.DiffRadian = function(v1, v2){
  return GeoCodeCalc.ToRadian(v2) - GeoCodeCalc.ToRadian(v1);
  };
  GeoCodeCalc.CalcDistance = function(lat1, lng1, lat2, lng2, radius){
  return radius * 2 * Math.asin( Math.min(1, Math.sqrt( ( Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(GeoCodeCalc.ToRadian(lat1)) * Math.cos(GeoCodeCalc.ToRadian(lat2)) * Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lng1, lng2)) / 2.0), 2.0) ) ) ) );
  };

  start();

	/**
	 * Checks for default location, full map, and HTML5 geolocation settings
	 */
  function start(){
    //If a default location is set
    if(settings.defaultLoc === true){
        //The address needs to be determined for the directions link
        var r = new ReverseGoogleGeocode();
        var latlng = new google.maps.LatLng(settings.defaultLat, settings.defaultLng);
				r.geocode({'latLng': latlng}, function(data){
          if(data !== null){
            var originAddress = data.address;
            mapping(originalData, settings.defaultLat, settings.defaultLng, originAddress);
          } else {
            //Unable to geocode
            alert(settings.addressErrorAlert);
          }
        });
    }

    //If show full map option is true
    if(settings.fullMapStart === true){
        //Just do the mapping without an origin
        mapping(originalData);
    }

    //HTML5 geolocation API option
    if(settings.autoGeocode === true){
        if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(autoGeocode_query, autoGeocode_error);
        }
    }
  }

	/**
	 * Geocode function used to geocode the origin (entered location)
	 */
  function GoogleGeocode(){
    geocoder = new google.maps.Geocoder();
		this.geocode = function(request, callbackFunction){
			geocoder.geocode(request, function(results, status){
          if (status === google.maps.GeocoderStatus.OK){
            var result = {};
            result.latitude = results[0].geometry.location.lat();
            result.longitude = results[0].geometry.location.lng();
            callbackFunction(result);
          } else {
            alert(settings.geocodeErrorAlert + status);
            callbackFunction(null);
          }
        });
    };
  }

	/**
	 * Reverse geocode to get address for automatic options needed for directions link
	 */
  function ReverseGoogleGeocode(){
    geocoder = new google.maps.Geocoder();
		this.geocode = function(request, callbackFunction){
			geocoder.geocode(request, function(results, status){
          if (status === google.maps.GeocoderStatus.OK){
            if (results[0]){
                var result = {};
                result.address = results[0].formatted_address;
                callbackFunction(result);
            }
          } else{
            alert(settings.geocodeErrorAlert + status);
            callbackFunction(null);
          }
			});
    };
  }

	/**
	 * Rounding function used for distances
	 *
	 * @param num {number} the full number
	 * @param dec {number} the number of digits to show after the decimal
	 * @returns {number}
	 */
  function roundNumber(num, dec){
    return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  }

	/**
	 * HTML5 geocoding function for automatic location detection
	 */
  function autoGeocode_query(position){
     //The address needs to be determined for the directions link
      var r = new ReverseGoogleGeocode();
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			r.geocode({'latLng': latlng}, function(data){
        if(data !== null){
          var originAddress = data.address;
          mapping(originalData, position.coords.latitude, position.coords.longitude, originAddress);
        } else {
          //Unable to geocode
          alert(settings.addressErrorAlert);
        }
      });
  }

  function autoGeocode_error(error){
    //If automatic detection doesn't work show an error
    alert(settings.autoGeocodeErrorAlert);
  }

	/**
	 * Google distance calculation WIP
	 */
	function calcRoute(start, end){
		var unitSystem;
		var directionsService = new google.maps.DirectionsService();

		if(settings.lengthUnit === 'm'){
			unitSystem = google.maps.UnitSystem.IMPERIAL
		}
		else{
			unitSystem = google.maps.UnitSystem.METRIC
		}

		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING, //Make new setting
			unitSystem: unitSystem
		};
		directionsService.route(request, function(response, status){
			if (status === google.maps.DirectionsStatus.OK){
				return(response);
			}
		});
	}

	/**
	 * Google distance matrix request probably not going to use but save for later
	 *
	 * @param origins {array} origins - in this case, the origin will always be what the user enters
	 * @param destinations {array} locations
	 */
	function calculateDistances(origins, destinations){
		var service = new google.maps.DistanceMatrixService();
		var request = {
				origins: origins,
				destinations: destinations,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL, //TODO: make setting
				avoidHighways: false,
				avoidTolls: false
		};

		service.getDistanceMatrix(request, function(response, status){
			if (status === google.maps.DistanceMatrixStatus.OK){
				return(response);
			}
		});
	}

	/**
	 * Set up the normal mapping
	 *
	 * @param distance {number} optional maximum distance
	 */
  function begin_mapping(distance){
    //Get the user input and use it
    var userinput = $('#' + settings.inputID).val();

		//Get the region setting if set
		var region = $('#' + settings.regionID).val();

    if (userinput === ''){
      start();
    }
    else{
      var g = new GoogleGeocode();
      var address = userinput;
			g.geocode({'address': address, 'region': region}, function(data){
        if(data !== null){
          olat = data.latitude;
          olng = data.longitude;
          mapping(originalData, olat, olng, userinput, distance);
        } else {
          //Unable to geocode
          alert(settings.addressErrorAlert);
        }
      });
    }
  }

	/**
	 * Process the form input
	 */
  $(function(){
    //Handle form submission
    function get_form_values(e){
      //Stop the form submission
      e.preventDefault();

      if(settings.maxDistance === true){
        var maxDistance = $('#' + settings.maxDistanceID).val();
        //Start the mapping
        begin_mapping(maxDistance);
      }
      else{
        //Start the mapping
        begin_mapping();
      }
    }

    //ASP.net or regular submission?
    if(settings.noForm === true){
      $(document).on('click.'+prefix, '.' + settings.formContainerDiv + ' button', function(e){
        get_form_values(e);
      });
      $(document).on('keyup.'+prefix, function(e){
        if (e.keyCode === 13 && $('#' + settings.inputID).is(':focus')){
          get_form_values(e);
        }
      });
    }
    else{
      $(document).on('submit.'+prefix, '#' + settings.formID, function(e){
        get_form_values(e);
      });
    }
  });

	/**
	 * Now all the mapping stuff
	 *
	 * @param data {kml,xml,or json} all location data
	 * @param orig_lat {number} origin latitude
	 * @param orig_lng {number} origin longitude
	 * @param origin {string} origin address
	 * @param maxDistance {number} optional maximum distance
	 */
  function mapping(data, orig_lat, orig_lng, origin, maxDistance){
  $(function(){

        //Enable the visual refresh https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh
        google.maps.visualRefresh = true;

				//Setup the origin point
				var originPoint = new google.maps.LatLng(orig_lat, orig_lng);

				/**
				 * Process the location data with AJAX
				 */
				originalDataRequest.then(function(){
            // Callback
            if(settings.callbackSuccess){
              settings.callbackSuccess.call(this, data, xhr, options);
            }

            //After the store locations file has been read successfully
            var i = 0;
            var firstRun;
						var originsArray = [];
						var destinationsArray = [];

            //Set a variable for fullMapStart so we can detect the first run
            if(settings.fullMapStart === true && $('#'+settings.mapDiv).hasClass('bh-storelocator-map-open') === false){
                firstRun = true;
            }
            else{
              reset();
            }

            $('#' + settings.mapDiv).addClass('bh-storelocator-map-open');

            //Depending on your data structure and what you want to include in the maps, you may need to change the following variables or comment them out
            if(settings.dataType === 'json' || settings.dataType === 'jsonp'){
              //Process JSON
              $.each(data, function(){
                  var key, value, locationData = {};

                  //Parse each data variable
                  for( key in this ){
                    value = this[key];

                    if(key === 'web'){
                      if ( value ) value = value.replace('http://',''); // Remove scheme (todo: should NOT be done)
                    }

                    locationData[key] = value;
                  }

                  if(!locationData['distance']){
                    locationData['distance'] = GeoCodeCalc.CalcDistance(orig_lat,orig_lng,locationData['lat'],locationData['lng'], GeoCodeCalc.EarthRadius);
                  }

                //Create the array
                if(settings.maxDistance === true && firstRun !== true && maxDistance){
                  if(locationData['distance'] < maxDistance){
                    locationset[i] = locationData;
                  }
                  else{
                    return;
                  }
                }
                else{
                  locationset[i] = locationData;
                }

                i++;
              });
            }
            else if(settings.dataType === 'kml'){
              //Process KML
              $(data).find('Placemark').each(function(){
                var locationData = {
                  'name': $(this).find('name').text(),
                  'lat': $(this).find('coordinates').text().split(',')[1],
                  'lng': $(this).find('coordinates').text().split(',')[0],
                  'description': $(this).find('description').text()
                };

                locationData['distance'] = GeoCodeCalc.CalcDistance(orig_lat,orig_lng,locationData['lat'],locationData['lng'], GeoCodeCalc.EarthRadius);

                //Create the array
                if(settings.maxDistance === true && firstRun !== true && maxDistance){
                  if(locationData['distance'] < maxDistance){
                    locationset[i] = locationData;
                  }
                  else{
                    return;
                  }
                }
                else{
                  locationset[i] = locationData;
                }

                i++;
              });
            }
            else{
              //Process XML
              $(data).find(settings.xmlElement).each(function(){
								var locationData = {};

								$.each(this.attributes, function(i, attrib){
									locationData[attrib.name] = attrib.value;
								});

                if(locationData['web']) locationData['web'] = locationData['web'].replace('http://',''); // Remove scheme (todo: should NOT be done)

								if(!locationData['distance']){
									locationData['distance'] = GeoCodeCalc.CalcDistance(orig_lat,orig_lng,locationData['lat'],locationData['lng'], GeoCodeCalc.EarthRadius);
									var locDest = new google.maps.LatLng(locationData['lat'], locationData['lng']);
									//Need to use distance matrix api or old calculation
									//var locDistance = calcRoute(originPoint, locDest);
									//console.log(originPoint);
									//locationData['distance'] = locDistance['routes'][0]

									originsArray[i] = originPoint;
									destinationsArray[i] = locDest;
								}

                //Create the array
                if(settings.maxDistance === true && firstRun !== true && maxDistance){
                  if(locationData['distance'] < maxDistance){
                    locationset[i] = locationData;
                  }
                  else{
                    return;
                  }
                }
                else{
										locationset[i] = locationData;
                }

                i++;
              });
            }

					function filterData(data, filters){
						var filterTest = true;

						for (var k in filters) {
							if (!(new RegExp(filters[k].join("")).test(data[k]))){
								filterTest = false;
							}
						}

						if(filterTest){
							return true;
						}
					}

					//Taxonomy filtering setup
					if(settings.taxonomyFilters !== null){
						var taxFilters = {};

						$.each(filters, function(k,v){
							if(v.length > 0){
								//Let's use regex
								for(var z = 0; z < v.length; z++){
									//Creating a new object so we don't mess up the original filters
									if(!taxFilters[k]){
										taxFilters[k] = [];
									}
									taxFilters[k][z] = '(?=.*\\b'
											+ v[z].replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
											+ '\\b)';
								}
							}
						});

						//Filter the data
						if(!$.isEmptyObject(taxFilters)){
							var filteredset = $.grep(locationset, function(val, i){
								return filterData(val, taxFilters);
							});

							locationset = filteredset;
						}
					}

					//TODO: isEmptyObject not supported in old IE - maybe use another method
					if($.isEmptyObject(locationset)){
						locationset[0] = {
							'address': 'No locations were found with the given criteria. Please modify your selections or input.',
							'address2': '',
							'lat': '',
							'lng': '',
							'name': 'No results'
						}
					}

					//Distance calculation update testing - there is a 100 element request limit
					/*if(locationset.length < 26){
						var matrix = calculateDistances(originsArray, destinationsArray);
						//console.log(matrix);
					}*/

          //Distance sorting function
          function sort_numerically(locationsarray){
            locationsarray.sort(function(a, b){
              return ((a['distance'] < b['distance']) ? -1 : ((a['distance'] > b['distance']) ? 1 : 0));
            });
          }

          //Sort the multi-dimensional array by distance
          sort_numerically(locationset);

          //Featured locations filtering
          if(settings.featuredLocations === true){
            //Create array for featured locations
            featuredset = $.grep(locationset, function(val, i){
              return val['featured'] === 'true';
            });

            //Create array for normal locations
            normalset = $.grep(locationset, function(val, i){
              return val['featured'] !== 'true';
            });

            //Combine the arrays
            locationset = [];
            locationset = featuredset.concat(normalset);
          }

          //Get the length unit
          var distUnit = (settings.lengthUnit === 'km') ? settings.kilometersLang : settings.milesLang ;

          //Check the closest marker
          if(settings.maxDistance === true && firstRun !== true && maxDistance){
            if(locationset[0] === undefined  || locationset[0]['distance'] > maxDistance){
              alert(settings.distanceErrorAlert + maxDistance + ' ' + distUnit);
              return;
            }
          }
          else{
            if(settings.distanceAlert !== -1 && locationset[0]['distance'] > settings.distanceAlert){
              alert(settings.distanceErrorAlert + settings.distanceAlert + ' ' + distUnit);
            }
          }

          //Create the map with jQuery
          $(function(){

             var key, value, locationData = {};

              //Instead of repeating the same thing twice below
              function create_location_variables(loopcount){
                for ( key in locationset[loopcount] ){
                  value = locationset[loopcount][key];

                  if(key === 'distance'){
                    value = roundNumber(value,2);
                  }

                  locationData[key] = value;
                }
              }

              //Define the location data for the templates
              function define_location_data(currentMarker){
                create_location_variables(currentMarker.get('id'));

                var distLength;
                if(locationData['distance'] <= 1){
                  if(settings.lengthUnit === 'km'){
                    distLength = settings.kilometerLang;
                  }
                  else{
                    distLength = settings.mileLang;
                  }
                }
                else{
                  if(settings.lengthUnit === 'km'){
                    distLength = settings.kilometersLang;
                  }
                  else{
                    distLength = settings.milesLang;
                  }
                }

                //Set up alpha character
                var markerId = currentMarker.get('id');
                //Use dot markers instead of alpha if there are more than 26 locations
                if(settings.storeLimit === -1 || settings.storeLimit > 26){
                  var indicator = markerId + 1;
                }
                else{
                  var indicator = String.fromCharCode('A'.charCodeAt(0) + markerId);
                }

                //Define location data
                var locations = {
                  location: [$.extend(locationData, {
                    'markerid': markerId,
                    'marker': indicator,
                    'length': distLength,
                    'origin': origin
                  })]
                };

                return locations;
              }

              //Slide in the map container
              if(settings.slideMap === true){
                $this.slideDown();
              }
              //Set up the modal window
              if(settings.modalWindow === true){
                // Callback
                if (settings.callbackModalOpen){
                  settings.callbackModalOpen.call(this);
                }

                function modalClose(){
                  // Callback
                  if (settings.callbackModalOpen){
                    settings.callbackModalOpen.call(this);
                  }

                  $(settings.overlayDiv).hide();
                }

                //Pop up the modal window
                $('.' + settings.overlayDiv).fadeIn();
                //Close modal when close icon is clicked and when background overlay is clicked TODO: Make sure this works with multiple
                $(document).on('click.'+prefix, settings.modalCloseIconDiv + ', ' + settings.overlayDiv, function(){
                    modalClose();
                });
                //Prevent clicks within the modal window from closing the entire thing
                $(document).on('click.'+prefix, settings.modalWindowDiv, function(e){
                    e.stopPropagation();
                });
                //Close modal when escape key is pressed
                $(document).on('keyup.'+prefix, function(e){
                  if (e.keyCode === 27){
                    modalClose();
                  }
                });
              }

              //Google maps settings
              if((settings.fullMapStart === true && firstRun === true) || (settings.mapSettings.zoom === 0)){
								var myOptions = settings.mapSettings;
                var bounds = new google.maps.LatLngBounds();
              }
              else{
								settings.mapSettings.center = originPoint;
                var myOptions = settings.mapSettings;
              }

              var map = new google.maps.Map(document.getElementById(settings.mapDiv.replace('#')),myOptions);
              //Load the map
							$this.data(settings.mapDiv.replace('#'), map);

              //Create one infowindow to fill later
              var infowindow = new google.maps.InfoWindow();

              //Avoid error if number of locations is less than the default of 26
              if(settings.storeLimit === -1 || (locationset.length-1) < settings.storeLimit-1){
                storenum = locationset.length-1;
              }
              else{
                storenum = settings.storeLimit-1;
              }

              //Add origin marker if the setting is set
              if(settings.originMarker === true && settings.fullMapStart === false){
                var marker = new google.maps.Marker({
                    position: originPoint,
                    map: map,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/'+ settings.originpinColor +'-dot.png',
                    draggable: false
                  });
              }

              //Add markers and infowindows loop
              for(var y = 0; y <= storenum; y++){
                var letter = String.fromCharCode('A'.charCodeAt(0) + y);
                var point = new google.maps.LatLng(locationset[y]['lat'], locationset[y]['lng']);
                marker = createMarker(point, locationset[y]['name'], locationset[y]['address'], letter );
                marker.set('id', y);
                markers[y] = marker;
                if((settings.fullMapStart === true && firstRun === true) || settings.mapSettings.zoom === 0){
                  bounds.extend(point);
                }
                //Pass variables to the pop-up infowindows
                create_infowindow(marker);
              }

              //Center and zoom if no origin or zoom was provided
              if((settings.fullMapStart === true && firstRun === true) || (settings.mapSettings.zoom === 0)){
                map.fitBounds(bounds);
              }

               //Create the links that focus on the related marker
               $(settings.listDiv + ' ul').empty();
               $(markers).each(function(x, marker){
                var letter = String.fromCharCode('A'.charCodeAt(0) + x);
                //This needs to happen outside the loop or there will be a closure problem with creating the infowindows attached to the list click
                var currentMarker = markers[x];
                listClick(currentMarker);
              });

              function listClick(marker){
                //Define the location data
                var locations = define_location_data(marker);

                //Set up the list template with the location data
                var listHtml = listTemplate(locations);
                $(settings.listDiv + ' ul').append(listHtml);
              }

              //Handle clicks from the list
              $(document).on('click.'+prefix, settings.listDiv + ' li', function(){
                var markerId = $(this).data('markerid');

                var selectedMarker = markers[markerId];

                //Focus on the list
                $(settings.listDiv + ' li').removeClass('list-focus');
                $(settings.listDiv + ' li[data-markerid=' + markerId +']').addClass('list-focus');

                map.panTo(selectedMarker.getPosition());
                var listLoc = 'left';
                if(settings.bounceMarker === true){
                  selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(function(){ selectedMarker.setAnimation(null); create_infowindow(selectedMarker, listLoc); }, 700);
                }
                else{
                  create_infowindow(selectedMarker, listLoc);
                }
              });

              //Add the list li background colors
              $(settings.listDiv + ' ul li:even').css('background', '#' + settings.listColor1);
              $(settings.listDiv + ' ul li:odd').css('background', '#' + settings.listColor2);

              //Custom marker function - alphabetical
              function createMarker(point, name, address, letter){
                //Set up pin icon with the Google Charts API for all of our markers
                var pinImage = new google.maps.MarkerImage('https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + letter + '|' + settings.pinColor + '|' + settings.pinTextColor,
                  new google.maps.Size(21, 34),
                  new google.maps.Point(0,0),
                  new google.maps.Point(10, 34));

                //Create the markers
                if(settings.storeLimit === -1 || settings.storeLimit > 26){
                  var marker = new google.maps.Marker({
                    position: point,
                    map: map,
                    draggable: false
                  });
                }
                else{
                  var marker = new google.maps.Marker({
                    position: point,
                    map: map,
                    icon: pinImage,
                    draggable: false
                  });
                }

                return marker;
              }

              //Infowindows
              function create_infowindow(marker, location){

                //Define the location data
                var locations = define_location_data(marker);

                //Set up the infowindow template with the location data
                var formattedAddress = infowindowTemplate(locations);

                //Opens the infowindow when list item is clicked
                if(location === 'left'){
                    infowindow.setContent(formattedAddress);
                    infowindow.open(marker.get('map'), marker);
                }
                //Opens the infowindow when the marker is clicked
                else{
                  google.maps.event.addListener(marker, 'click', function(){
                      infowindow.setContent(formattedAddress);
                      infowindow.open(marker.get('map'), marker);
                      //Focus on the list
                      $(settings.listDiv + ' li').removeClass('list-focus');
                      markerId = marker.get('id');
                      $(settings.listDiv + ' li[data-markerid=' + markerId +']').addClass('list-focus');

                      //Scroll list to selected marker
                      var container = $(settings.listDiv),scrollTo = $(settings.listDiv + ' li[data-markerid=' + markerId +']');
                      $(settings.listDiv).animate({
                          scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                      });
                  });
                }

              }

          });
        });
    });
  }

  }

  });
};
})(jQuery);