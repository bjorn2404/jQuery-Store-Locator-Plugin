/*
 * storeLocator v1.4.9 - jQuery Google Maps Store Locator Plugin
 * (c) Copyright 2013, Bjorn Holine (http://www.bjornblog.com)
 * Released under the MIT license
 */

/* global define, window, document, Handlebars, alert, google */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = "storeLocator";

	// Only allow for one instantiation of this script
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	// Variables used across multiple functions		
	var $this, listTemplate, infowindowTemplate, dataTypeRead, originalData, originalDataRequest, originalZoom, userInput, olat, olng, storeNum;
	var featuredset, locationset, normalset, markers = [];
	var filters = {};
	var locationData = {};
	var GeoCodeCalc = {};
	var prefix = 'storeLocator';

	// Create the defaults once. Do not change these settings in this file - settings should be overridden in the plugin call
	var defaults = {
		'mapDiv'                   : 'map',
		'listDiv'                  : '.bh-storelocator-loc-list',
		'formContainerDiv'         : 'bh-storelocator-form-container',
		'formID'                   : 'user-location',
		'inputID'                  : 'address',
		'regionID'                 : 'region',
		'mapSettings'              : {
			zoom     : 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		'pinColor'                 : 'fe7569',
		'pinTextColor'             : '000000',
		'lengthUnit'               : 'm',
		'storeLimit'               : 26,
		'distanceAlert'            : 60,
		'dataType'                 : 'xml',
		'dataLocation'             : 'data/locations.xml',
		'xmlElement'               : 'marker',
		'listColor1'               : 'ffffff',
		'listColor2'               : 'eeeeee',
		'originMarker'             : false,
		'originpinColor'           : 'blue',
		'bounceMarker'             : true,
		'slideMap'                 : true,
		'modalWindow'              : false,
		'overlayDiv'               : 'bh-storelocator-overlay',
		'modalWindowDiv'           : 'bh-storelocator-modal-window',
		'modalContentDiv'          : 'bh-storelocator-modal-content',
		'modalCloseIconDiv'        : 'bh-storelocator-modal-close-icon',
		'defaultLoc'               : false,
		'defaultLat'               : '',
		'defaultLng'               : '',
		'autoGeocode'              : false,
		'maxDistance'              : false,
		'maxDistanceID'            : 'maxdistance',
		'fullMapStart'             : false,
		'noForm'                   : false,
		'loading'                  : false,
		'loadingDiv'               : 'bh-storelocator-loading',
		'featuredLocations'        : false,
		'pagination'               : false,
		'locationsPerPage'         : 10,
		'infowindowTemplatePath'   : 'templates/infowindow-description.html',
		'listTemplatePath'         : 'templates/location-list-description.html',
		'KMLinfowindowTemplatePath': 'templates/kml-infowindow-description.html',
		'KMLlistTemplatePath'      : 'templates/kml-location-list-description.html',
		'listTemplateID'           : null,
		'infowindowTemplateID'     : null,
		'taxonomyFilters'          : null,
		'callbackBeforeSend'       : null,
		'callbackComplete'         : null,
		'callbackSuccess'          : null,
		'callbackModalOpen'        : null,
		'callbackModalClose'       : null,
		'jsonpCallback'            : null,
		// Language options
		'geocodeErrorAlert'        : 'Geocode was not successful for the following reason: ',
		'addressErrorAlert'        : 'Unable to find address',
		'autoGeocodeErrorAlert'    : 'Automatic location detection failed. Please fill in your address or zip code.',
		'distanceErrorAlert'       : 'Unfortunately, our closest location is more than ',
		'mileLang'                 : 'mile',
		'milesLang'                : 'miles',
		'kilometerLang'            : 'kilometer',
		'kilometersLang'           : 'kilometers',
		'noResultsTitle'           : 'No results',
		'noResultsDesc'            : 'No locations were found with the given criteria. Please modify your selections or input.'
	};

	// Plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		/**
		 * Distance calculations
		 */
		geoCodeCalcToRadian: function (v) {
			return v * (Math.PI / 180);
		},
		geoCodeCalcDiffRadian: function (v1, v2) {
			return this.geoCodeCalcToRadian(v2) - this.geoCodeCalcToRadian(v1);
		},
		geoCodeCalcCalcDistance: function (lat1, lng1, lat2, lng2, radius) {
			return radius * 2 * Math.asin(Math.min(1, Math.sqrt(( Math.pow(Math.sin((this.geoCodeCalcDiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(this.geoCodeCalcToRadian(lat1)) * Math.cos(this.geoCodeCalcToRadian(lat2)) * Math.pow(Math.sin((this.geoCodeCalcDiffRadian(lng1, lng2)) / 2.0), 2.0) ))));
		},
		/**
		 * Init function
		 */
		init: function () {
			var source;
			var _this = this;
			
			// Calculate geocode distance functions
			if (this.settings.lengthUnit === 'km') {
				//Kilometers
				GeoCodeCalc.EarthRadius = 6367.0;
			}
			else {
				// Default is miles
				GeoCodeCalc.EarthRadius = 3956.0;
			}

			// KML is read as XML
			if (this.settings.dataType === 'kml') {
				dataTypeRead = 'xml';
			}
			else {
				dataTypeRead = this.settings.dataType;
			}

			originalDataRequest = this.getData();

			// Save this separately so we can avoid multiple AJAX requests
			originalDataRequest.done(function (data) {
				originalData = data;
			});

			// Save the original zoom setting so it can be retrieved if taxonomy filtering resets it
			originalZoom = this.settings.mapSettings.zoom;

			/**
			 * Load the external template files first
			 */
			// Get the KML templates
			if (this.settings.dataType === 'kml' && this.settings.listTemplateID === null && this.settings.infowindowTemplateID === null) {
				
				// Try loading the external template files
				$.when(
					// KML infowindows
					$.get(this.settings.KMLinfowindowTemplatePath, function (template) {
						source = template;
						infowindowTemplate = Handlebars.compile(source);
					}),

					// KML locations list
					$.get(this.settings.KMLlistTemplatePath, function (template) {
						source = template;
						listTemplate = Handlebars.compile(source);
					})

				).then(function () {
					// Continue to the main script if templates are loaded successfully
					_this.locator();

				}, function () {
					// KML templates not loaded - you can add a console.log here to see if your templates are failing

				});
			}
			// Handle script tag template method
			else if (this.settings.listTemplateID !== null && this.settings.infowindowTemplateID !== null) {
				//TODO: Test this
				// Infowindows
				infowindowTemplate = Handlebars.compile($(this.settings.infowindowTemplateID).html());

				// Locations list
				listTemplate = Handlebars.compile($(this.settings.listTemplateID).html());

				// Continue to the main script
				_this.locator();
			}
			// Get the JSON/XML templates
			else {
				// Try loading the external template files
				$.when(
					// Infowindows
					$.get(this.settings.infowindowTemplatePath, function (template) {
						source = template;
						infowindowTemplate = Handlebars.compile(source);
					}),

					// Locations list
					$.get(this.settings.listTemplatePath, function (template) {
						source = template;
						listTemplate = Handlebars.compile(source);
					})

				).then(function () {
					// Continue to the main script if templates are loaded successfully
					_this.locator();

				}, function () {
					// JSON/XML templates not loaded - you can add a console.log here to see if your templates are failing

				});
			}
		},

		/**
		 * Reset function
		 */
		reset: function () {
			locationset = [];
			featuredset = [];
			normalset = [];
			markers = [];
			$(document).off('click.' + prefix, this.settings.listDiv + ' li');
		},

		/**
		 * Handle form submission
		 *
		 * @param e {event}
		 */
		getFormValues: function (e) {
			// Stop the form submission
			e.preventDefault();

			if (this.settings.maxDistance === true) {
				var maxDistance = $('#' + this.settings.maxDistanceID).val();
				// Start the mapping
				this.beginMapping(maxDistance);
			}
			else {
				// Start the mapping
				this.beginMapping();
			}
		},

		/**
		 * Process the form input
		 */
		processFormInput: function () {
			var _this = this;
			// ASP.net or regular submission?
			if (this.settings.noForm === true) {
				$(document).on('click.' + prefix, '.' + this.settings.formContainerDiv + ' button', function (e) {
					_this.getFormValues(e);
				});
				$(document).on('keyup.' + prefix, function (e) {
					if (e.keyCode === 13 && $('#' + _this.settings.inputID).is(':focus')) {
						_this.getFormValues(e);
					}
				});
			}
			else {
				$(document).on('submit.' + prefix, '#' + this.settings.formID, function (e) {
					_this.getFormValues(e);
				});
			}
		},

		/**
		 * Changing AJAX call to this function. TODO: Add old callbacks, maybe switch to when/then
		 */
		getData: function () {
			var d = $.Deferred();

			$.ajax({
				type         : 'GET',
				url          : this.settings.dataLocation + (this.settings.dataType === 'jsonp' ? (this.settings.dataLocation.match(/\?/) ? '&' : '?') + 'callback=?' : ''),
				dataType     : dataTypeRead,
				jsonpCallback: (this.settings.dataType === 'jsonp' ? this.settings.jsonpCallback : null)
			}).done(function (p) {
				d.resolve(p);
			}).fail(d.reject);
			return d.promise();
		},

		/**
		 * Count the selected filters
		 *
		 * @returns {number}
		 */
		countFilters: function () {
			var filterCount = 0;

			if (!this.isEmptyObject(filters)) {
				for (var key in filters) {
					if (filters.hasOwnProperty(key)) {
						filterCount += filters[key].length;
					}
				}
			}

			return filterCount;
		},

		/**
		 * Check for existing filter selections
		 */
		checkFilters: function () {
			$.each(this.settings.taxonomyFilters, function (k, v) {
				// Find the existing checked boxes for each checkbox filter
				$(v + ' input[type=checkbox]').each(function () {
					if ($(this).prop('checked')) {
						var filterVal = $(this).attr('id');

						// Only add the taxonomy id if it doesn't already exist
						if (filters[k].indexOf(filterVal) === -1) {
							filters[k].push(filterVal);
						}
					}
				});

				// Find the existing selected value for each select filter
				$(v + ' select').each(function () {
					var filterVal = $(this).attr('id');

					// Only add the taxonomy id if it doesn't already exist
					if (filters[k].indexOf(filterVal) === -1) {
						filters[k].push(filterVal);
					}
				});
			});
		},

		/**
		 * Get the filter key from the taxonomyFilter setting
		 *
		 * @param filterContainer {string} ID of the changed filter's container
		 */
		getFilterKey: function (filterContainer) {
			for (var key in this.settings.taxonomyFilters) {
				if (this.settings.taxonomyFilters.hasOwnProperty(key)) {
					for (var i = 0; i < this.settings.taxonomyFilters[key].length; i++) {
						if (this.settings.taxonomyFilters[key] === filterContainer) {
							return key;
						}
					}
				}
			}
		},

		/**
		 * Checks for default location, full map, and HTML5 geolocation settings
		 */
		start: function () {
			var _this = this;
			// If a default location is set
			if (this.settings.defaultLoc === true) {
				// The address needs to be determined for the directions link
				var r = new this.reverseGoogleGeocode();
				var latlng = new google.maps.LatLng(this.settings.defaultLat, this.settings.defaultLng);
				r.geocode({'latLng': latlng}, function (data) {
					if (data !== null) {
						var originAddress = data.address;
						_this.mapping(originalData, _this.settings.defaultLat, _this.settings.defaultLng, originAddress);
					} else {
						// Unable to geocode
						alert(this.settings.addressErrorAlert);
					}
				});
			}

			// If show full map option is true
			if (this.settings.fullMapStart === true) {
				// Just do the mapping without an origin
				this.mapping(originalData);
			}

			// HTML5 geolocation API option
			if (this.settings.autoGeocode === true) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position){
						// Have to do this to get around scope issues
						_this.autoGeocodeQuery(position);
					}, function(error){
						_this.autoGeocodeError(error);
					});
				}
			}
		},

		/**
		 * Geocode function used to geocode the origin (entered location)
		 */
		googleGeocode: function () {
			var geocoder = new google.maps.Geocoder();
			this.geocode = function (request, callbackFunction) {
				geocoder.geocode(request, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						var result = {};
						result.latitude = results[0].geometry.location.lat();
						result.longitude = results[0].geometry.location.lng();
						callbackFunction(result);
					} else {
						alert(this.settings.geocodeErrorAlert + status);
						callbackFunction(null);
					}
				});
			};
		},

		/**
		 * Reverse geocode to get address for automatic options needed for directions link
		 */
		reverseGoogleGeocode: function () {
			var geocoder = new google.maps.Geocoder();
			this.geocode = function (request, callbackFunction) {
				geocoder.geocode(request, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							var result = {};
							result.address = results[0].formatted_address;
							callbackFunction(result);
						}
					} else {
						alert(this.settings.geocodeErrorAlert + status);
						callbackFunction(null);
					}
				});
			};
		},

		/**
		 * Rounding function used for distances
		 *
		 * @param num {number} the full number
		 * @param dec {number} the number of digits to show after the decimal
		 * @returns {number}
		 */
		roundNumber: function (num, dec) {
			return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
		},

		/**
		 * Checks to see if the object is empty. Using this instead of $.isEmptyObject for legacy browser support
		 *
		 * @param obj {object} the object to check
		 * @returns {boolean}
		 */
		isEmptyObject: function (obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		},

		/**
		 * Modal window close function
		 */
		modalClose: function () {
			// Callback
			if (this.settings.callbackModalOpen) {
				this.settings.callbackModalOpen.call(this);
			}

			$('.' + this.settings.overlayDiv).hide();
		},

		/**
		 * Create the location variables
		 *
		 * @param loopcount {number} current marker id
		 */
		createLocationVariables: function (loopcount) {
			var value;

			for (var key in locationset[loopcount]) {
				if (locationset[loopcount].hasOwnProperty(key)) {
					value = locationset[loopcount][key];

					if (key === 'distance') {
						value = this.roundNumber(value, 2);
					}

					locationData[key] = value;
				}
			}
		},

		/**
		 * Location distance sorting function
		 *
		 * @param locationsarray {array} locationset array
		 */
		sortNumerically: function (locationsarray) {
			locationsarray.sort(function (a, b) {
				return ((a.distance < b.distance) ? -1 : ((a.distance > b.distance) ? 1 : 0));
			});
		},

		/**
		 * Filter the data with Regex
		 *
		 * @param data
		 * @param filters
		 * @returns {boolean}
		 */
		filterData: function (data, filters) {
			var filterTest = true;

			for (var k in filters) {
				if (!(new RegExp(filters[k].join("")).test(data[k]))) {
					filterTest = false;
				}
			}

			if (filterTest) {
				return true;
			}
		},

		/**
		 * Set up the pagination pages
		 *
		 * @param currentPage (number) optional current page
		 */
		paginationSetup: function (currentPage) {
			// Only append the pagination number if they're not already appended
			if ($('.bh-storelocator-pagination-container ol').length === 0) {
				if (currentPage === undefined) {
					currentPage = 0;
				}
				var pagesOutput = '';

				for (var p = 0; p < (locationset.length / this.settings.locationsPerPage); p++) {
					var n = p + 1;

					if (p === currentPage) {
						pagesOutput += '<li data-page="' + p + '" class="bh-storelocator-current">' + n + '</li>';
					}
					else {
						pagesOutput += '<li data-page="' + p + '">' + n + '</li>';
					}
				}
				//TODO: Target this better
				$('.bh-storelocator-pagination-container').append('<ol class="bh-storelocator-pagination">' + pagesOutput + '</ol>');
			}
		},

		/**
		 * Google distance calculation WIP
		 */
		calcRoute: function (start, end) {
			var unitSystem;
			var directionsService = new google.maps.DirectionsService();

			if (this.settings.lengthUnit === 'm') {
				unitSystem = google.maps.UnitSystem.IMPERIAL;
			}
			else {
				unitSystem = google.maps.UnitSystem.METRIC;
			}

			var request = {
				origin     : start,
				destination: end,
				travelMode : google.maps.TravelMode.DRIVING, //Make new setting
				unitSystem : unitSystem
			};
			directionsService.route(request, function (response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					return(response);
				}
			});
		},

		/**
		 * Google distance matrix request probably not going to use but save for later
		 *
		 * @param origins {array} origins - in this case, the origin will always be what the user enters
		 * @param destinations {array} locations
		 */
		calculateDistances: function (origins, destinations) {
			var service = new google.maps.DistanceMatrixService();
			var request = {
				origins      : origins,
				destinations : destinations,
				travelMode   : google.maps.TravelMode.DRIVING,
				unitSystem   : google.maps.UnitSystem.IMPERIAL, //TODO: make setting
				avoidHighways: false,
				avoidTolls   : false
			};

			service.getDistanceMatrix(request, function (response, status) {
				if (status === google.maps.DistanceMatrixStatus.OK) {
					return(response);
				}
			});
		},

		/**
		 * Map marker setup
		 *
		 * @param point
		 * @param name
		 * @param address
		 * @param letter
		 * @returns {google.maps.Marker}
		 */
		createMarker: function (point, name, address, letter, map) {
			var marker;

			// Set up pin icon with the Google Charts API for all of our markers
			var pinImage = new google.maps.MarkerImage('https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + letter + '|' + this.settings.pinColor + '|' + this.settings.pinTextColor,
					new google.maps.Size(21, 34),
					new google.maps.Point(0, 0),
					new google.maps.Point(10, 34));

			// Create the markers
			if (this.settings.storeLimit === -1 || this.settings.storeLimit > 26) {
				marker = new google.maps.Marker({
					position : point,
					map      : map,
					draggable: false
				});
			}
			else {
				marker = new google.maps.Marker({
					position : point,
					map      : map,
					icon     : pinImage,
					draggable: false
				});
			}

			return marker;
		},

		/**
		 * Define the location data for the templates
		 *
		 * @param currentMarker {object} Google Maps marker
		 * @param storeStart {number} optional first location on the current page
		 * @param page {number} optional current page
		 * @returns {{location: *[]}}
		 */
		defineLocationData: function (currentMarker, storeStart, page) {
			var indicator = "";
			this.createLocationVariables(currentMarker.get('id'));

			var distLength;
			if (locationData.distance <= 1) {
				if (this.settings.lengthUnit === 'km') {
					distLength = this.settings.kilometerLang;
				}
				else {
					distLength = this.settings.mileLang;
				}
			}
			else {
				if (this.settings.lengthUnit === 'km') {
					distLength = this.settings.kilometersLang;
				}
				else {
					distLength = this.settings.milesLang;
				}
			}

			// Set up alpha character
			var markerId = currentMarker.get('id');
			// Use dot markers instead of alpha if there are more than 26 locations
			if (this.settings.storeLimit === -1 || this.settings.storeLimit > 26) {
				indicator = markerId + 1;
			}
			else {
				if (page > 0) {
					indicator = String.fromCharCode('A'.charCodeAt(0) + (storeStart + markerId));
				}
				else {
					indicator = String.fromCharCode('A'.charCodeAt(0) + markerId);
				}
			}

			// Define location data
			var locations = {
				location: [$.extend(locationData, {
					'markerid': markerId,
					'marker'  : indicator,
					'length'  : distLength,
					'origin'  : userInput
				})]
			};

			return locations;
		},

		/**
		 * Set up the list templates TODO: Maybe rename this function because it's doing more than just handling the clicks
		 *
		 * @param marker {object} Google Maps marker
		 * @param storeStart {number} optional first location on the current page
		 * @param page {number} optional current page
		 */
		listClick: function (marker, storeStart, page) {
			// Define the location data
			var locations = this.defineLocationData(marker, storeStart, page);

			// Set up the list template with the location data
			var listHtml = listTemplate(locations);
			$(this.settings.listDiv + ' ul').append(listHtml);
		},

		// Infowindows
		createInfowindow: function (marker, location, infowindow, storeStart, page) {
			var _this = this;
			// Define the location data
			var locations = this.defineLocationData(marker, storeStart, page);

			// Set up the infowindow template with the location data
			var formattedAddress = infowindowTemplate(locations);

			// Opens the infowindow when list item is clicked
			if (location === 'left') {
				infowindow.setContent(formattedAddress);
				infowindow.open(marker.get('map'), marker);
			}
			// Opens the infowindow when the marker is clicked
			else {
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(formattedAddress);
					infowindow.open(marker.get('map'), marker);
					// Focus on the list
					$(_this.settings.listDiv + ' li').removeClass('list-focus');
					var markerId = marker.get('id');
					$(_this.settings.listDiv + ' li[data-markerid=' + markerId + ']').addClass('list-focus');

					// Scroll list to selected marker
					var container = $(_this.settings.listDiv), scrollTo = $(_this.settings.listDiv + ' li[data-markerid=' + markerId + ']');
					$(_this.settings.listDiv).animate({
						scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
					});
				});
			}
		},

		/**
		 * HTML5 geocoding function for automatic location detection
		 */
		autoGeocodeQuery: function (position) {
			var _this = this;
			// The address needs to be determined for the directions link
			var r = new this.reverseGoogleGeocode();
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			r.geocode({'latLng': latlng}, function (data) {
				if (data !== null) {
					var originAddress = data.address;
					_this.mapping(originalData, position.coords.latitude, position.coords.longitude, originAddress);
				} else {
					// Unable to geocode
					alert(this.settings.addressErrorAlert);
				}
			});
		},

		/**
		 * Handle autoGeocode failure
		 *
		 * @param error
		 */
		autoGeocodeError: function (error) {
			// If automatic detection doesn't work show an error
			alert(this.settings.autoGeocodeErrorAlert);
		},

		/**
		 * Change the page
		 *
		 * @param newPage
		 */
		paginationChange: function (newPage) {
			var maxDistance;

			if (this.settings.maxDistance === true) {
				maxDistance = $('#' + this.settings.maxDistanceID).val();
			}

			this.reset();
			this.mapping(originalData, olat, olng, userInput, maxDistance, newPage);
		},

		/**
		 * Set up the normal mapping
		 *
		 * @param distance {number} optional maximum distance
		 */
		beginMapping: function (distance) {
			var _this = this;
			// Get the user input and use it
			userInput = $('#' + this.settings.inputID).val();

			// Get the region setting if set
			var region = $('#' + this.settings.regionID).val();

			if (userInput === '') {
				this.start();
			}
			else {
				var g = new this.googleGeocode();
				var address = userInput;
				g.geocode({'address': address, 'region': region}, function (data) {
					if (data !== null) {
						olat = data.latitude;
						olng = data.longitude;
						_this.mapping(originalData, olat, olng, userInput, distance);
					} else {
						// Unable to geocode
						alert(this.settings.addressErrorAlert);
					}
				});
			}
		},

		/**
		 * The primary mapping function that runs everything
		 *
		 * @param data {kml,xml,or json} all location data
		 * @param orig_lat {number} origin latitude
		 * @param orig_lng {number} origin longitude
		 * @param origin {string} origin address
		 * @param maxDistance {number} optional maximum distance
		 */
		mapping: function (data, orig_lat, orig_lng, origin, maxDistance, page) {
			var _this = this;
			// Enable the visual refresh https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh
			google.maps.visualRefresh = true;

			// Setup the origin point
			var originPoint = new google.maps.LatLng(orig_lat, orig_lng);

			// Set the initial page to zero if not set
			if (page === undefined) {
				page = 0;
			}

			/**
			 * Process the location data
			 */
			originalDataRequest.then(function () {
				// Callback
				if (_this.settings.callbackSuccess) {
					_this.settings.callbackSuccess.call(_this, data, xhr, options);
				}

				var i = 0;
				var firstRun;
				var originsArray = [];
				var destinationsArray = [];

				// Set a variable for fullMapStart so we can detect the first run
				if (_this.settings.fullMapStart === true && $('#' + _this.settings.mapDiv).hasClass('bh-storelocator-map-open') === false) {
					firstRun = true;
				}
				else {
					_this.reset();
				}

				$('#' + _this.settings.mapDiv).addClass('bh-storelocator-map-open');

				// Process the location data depending on the data format type
				if (_this.settings.dataType === 'json' || _this.settings.dataType === 'jsonp') {
					// Process JSON
					$.each(data, function () {
						var key, value, locationData = {};

						// Parse each data variable
						for (key in this) {
							if (this.hasOwnProperty(key)) {
								value = this[key];

								if (key === 'web') {
									if (value) {
										value = value.replace('http://', '');
									} // Remove scheme (todo: should NOT be done)
								}

								locationData[key] = value;
							}
						}

						if (!locationData.distance) {
							locationData.distance = _this.geoCodeCalcCalcDistance(orig_lat, orig_lng, locationData.lat, locationData.lng, GeoCodeCalc.EarthRadius);
						}

						// Create the array
						if (_this.settings.maxDistance === true && firstRun !== true && maxDistance) {
							if (locationData.distance < maxDistance) {
								locationset[i] = locationData;
							}
							else {
								return;
							}
						}
						else {
							locationset[i] = locationData;
						}

						i++;
					});
				}
				else if (_this.settings.dataType === 'kml') {
					// Process KML
					$(data).find('Placemark').each(function () {
						var locationData = {
							'name'       : $(this).find('name').text(),
							'lat'        : $(this).find('coordinates').text().split(',')[1],
							'lng'        : $(this).find('coordinates').text().split(',')[0],
							'description': $(this).find('description').text()
						};

						locationData.distance = _this.geoCodeCalcCalcDistance(orig_lat, orig_lng, locationData.lat, locationData.lng, GeoCodeCalc.EarthRadius);

						// Create the array
						if (_this.settings.maxDistance === true && firstRun !== true && maxDistance) {
							if (locationData.distance < maxDistance) {
								locationset[i] = locationData;
							}
							else {
								return;
							}
						}
						else {
							locationset[i] = locationData;
						}

						i++;
					});
				}
				else {
					// Process XML
					$(data).find(_this.settings.xmlElement).each(function () {
						var locationData = {};

						$.each(this.attributes, function (i, attrib) {
							locationData[attrib.name] = attrib.value;
						});

						if (locationData.web) {
							locationData.web = locationData.web.replace('http://', '');
						} // Remove scheme (todo: should NOT be done)

						if (!locationData.distance) {
							locationData.distance = _this.geoCodeCalcCalcDistance(orig_lat, orig_lng, locationData.lat, locationData.lng, GeoCodeCalc.EarthRadius);
							var locDest = new google.maps.LatLng(locationData.lat, locationData.lng);
							// Need to use distance matrix api or old calculation
							// var locDistance = calcRoute(originPoint, locDest);
							// console.log(originPoint);
							// locationData['distance'] = locDistance['routes'][0]

							originsArray[i] = originPoint;
							destinationsArray[i] = locDest;
						}

						// Create the array
						if (_this.settings.maxDistance === true && firstRun !== true && maxDistance) {
							if (locationData.distance < maxDistance) {
								locationset[i] = locationData;
							}
							else {
								return;
							}
						}
						else {
							locationset[i] = locationData;
						}

						i++;
					});
				}


				// Taxonomy filtering setup
				if (_this.settings.taxonomyFilters !== null) {
					var taxFilters = {};

					$.each(filters, function (k, v) {
						if (v.length > 0) {
							// Let's use regex
							for (var z = 0; z < v.length; z++) {
								// Creating a new object so we don't mess up the original filters
								if (!taxFilters[k]) {
									taxFilters[k] = [];
								}
								taxFilters[k][z] = '(?=.*\\b' + v[z].replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + '\\b)';
							}
						}
					});

					// Filter the data
					if (!_this.isEmptyObject(taxFilters)) {
						var filteredset = $.grep(locationset, function (val, i) {
							return _this.filterData(val, taxFilters);
						});

						locationset = filteredset;
					}
				}

				//TODO: Need to come up with something different that reads the keys from the data
				if (_this.isEmptyObject(locationset)) {
					locationset[0] = {
						'address' : _this.settings.noResultsDesc,
						'address2': '',
						'lat'     : '',
						'lng'     : '',
						'name'    : _this.settings.noResultsTitle
					};
				}

				// Distance calculation update testing - there is a 100 element request limit
				/*if(locationset.length < 26){
				var matrix = calculateDistances(originsArray, destinationsArray);
				//console.log(matrix);
				}*/

				// Sort the multi-dimensional array by distance
				_this.sortNumerically(locationset);

				// Featured locations filtering
				if (_this.settings.featuredLocations === true) {
					// Create array for featured locations
					featuredset = $.grep(locationset, function (val, i) {
						return val['featured'] === 'true';
					});

					// Create array for normal locations
					normalset = $.grep(locationset, function (val, i) {
						return val['featured'] !== 'true';
					});

					// Combine the arrays
					locationset = [];
					locationset = featuredset.concat(normalset);
				}

				// Get the length unit
				var distUnit = (_this.settings.lengthUnit === 'km') ? _this.settings.kilometersLang : _this.settings.milesLang;

				// Check the closest marker
				if (_this.settings.maxDistance === true && firstRun !== true && maxDistance) {
					if (locationset[0] === undefined || locationset[0].distance > maxDistance) {
						alert(_this.settings.distanceErrorAlert + maxDistance + ' ' + distUnit);
						return;
					}
				}
				else {
					if (_this.settings.distanceAlert !== -1 && locationset[0].distance > _this.settings.distanceAlert) {
						alert(_this.settings.distanceErrorAlert + _this.settings.distanceAlert + ' ' + distUnit);
					}
				}

				// Output page numbers if pagination setting is true
				if (_this.settings.pagination === true) {
					_this.paginationSetup();
				}

				// Create the map with jQuery
				$(function () {

					var storeStart, storeNumToShow, myOptions;

					// Slide in the map container
					if (_this.settings.slideMap === true) {
						$this.slideDown();
					}
					// Set up the modal window
					if (_this.settings.modalWindow === true) {
						// Callback
						if (_this.settings.callbackModalOpen) {
							_this.settings.callbackModalOpen.call(this);
						}

						// Pop up the modal window
						$('.' + _this.settings.overlayDiv).fadeIn();
						// Close modal when close icon is clicked and when background overlay is clicked TODO: Make sure this works with multiple
						$(document).on('click.' + prefix, '.' + _this.settings.modalCloseIconDiv + ', .' + _this.settings.overlayDiv, function () {
							_this.modalClose();
						});
						// Prevent clicks within the modal window from closing the entire thing
						$(document).on('click.' + prefix, _this.settings.modalWindowDiv, function (e) {
							e.stopPropagation();
						});
						// Close modal when escape key is pressed
						$(document).on('keyup.' + prefix, function (e) {
							if (e.keyCode === 27) {
								_this.modalClose();
							}
						});
					}

					// Avoid error if number of locations is less than the default of 26
					if (_this.settings.storeLimit === -1 || (locationset.length ) < _this.settings.storeLimit) {
						storeNum = locationset.length;
					}
					else {
						storeNum = _this.settings.storeLimit;
					}

					// If pagination is on, change the store limit to the setting and slice the locationset array
					if (_this.settings.pagination === true) {
						storeNumToShow = _this.settings.locationsPerPage;
						storeStart = page * _this.settings.locationsPerPage;

						locationset = locationset.slice(storeStart, storeStart + storeNumToShow);
						storeNum = locationset.length;
					}
					else {
						storeNumToShow = storeNum;
						storeStart = 0;
					}

					// Google maps settings
					if ((_this.settings.fullMapStart === true && firstRun === true) || (_this.settings.mapSettings.zoom === 0)) {
						myOptions = _this.settings.mapSettings;
						var bounds = new google.maps.LatLngBounds();
					}
					else if (_this.settings.pagination === true) {
						// Update the map to focus on the first point in the new set
						var nextPoint = new google.maps.LatLng(locationset[0].lat, locationset[0].lng);

						if (page === 0) {
							_this.settings.mapSettings.center = originPoint;
							myOptions = _this.settings.mapSettings;
						}
						else {
							_this.settings.mapSettings.center = nextPoint;
							myOptions = _this.settings.mapSettings;
						}
					}
					else {
						_this.settings.mapSettings.center = originPoint;
						myOptions = _this.settings.mapSettings;
					}

					var map = new google.maps.Map(document.getElementById(_this.settings.mapDiv.replace('#')), myOptions);
					// Load the map
					$this.data(_this.settings.mapDiv.replace('#'), map);

					// Create one infowindow to fill later
					var infowindow = new google.maps.InfoWindow();

					// Add origin marker if the setting is set
					if (_this.settings.originMarker === true && settings.fullMapStart === false) {
						var marker = new google.maps.Marker({
							position : originPoint,
							map      : map,
							icon     : 'https://maps.google.com/mapfiles/ms/icons/' + _this.settings.originpinColor + '-dot.png',
							draggable: false
						});
					}

					// Handle pagination
					$(document).on('click.' + prefix, '.bh-storelocator-pagination li', function () {
						// Remove the current class
						$('.bh-storelocator-pagination li').attr('class', '');

						// Add the current class
						$(this).addClass('bh-storelocator-current');

						// Run paginationChange
						_this.paginationChange($(this).attr('data-page'));
					});

					// Add markers and infowindows loop
					for (var y = 0; y <= storeNumToShow - 1; y++) {
						var letter = "";

						if (page > 0) {
							letter = String.fromCharCode('A'.charCodeAt(0) + (storeStart + y));
						}
						else {
							letter = String.fromCharCode('A'.charCodeAt(0) + y);
						}

						var point = new google.maps.LatLng(locationset[y].lat, locationset[y].lng);
						marker = _this.createMarker(point, locationset[y].name, locationset[y].address, letter, map);
						marker.set('id', y);
						markers[y] = marker;
						if ((_this.settings.fullMapStart === true && firstRun === true) || _this.settings.mapSettings.zoom === 0) {
							bounds.extend(point);
						}
						// Pass variables to the pop-up infowindows
						_this.createInfowindow(marker, null, infowindow, storeStart, page);
					}

					// Center and zoom if no origin or zoom was provided
					if ((_this.settings.fullMapStart === true && firstRun === true) || (_this.settings.mapSettings.zoom === 0)) {
						map.fitBounds(bounds);
					}

					// Create the links that focus on the related marker
					$(_this.settings.listDiv + ' ul').empty();
					$(markers).each(function (x, marker) {
						var letter = String.fromCharCode('A'.charCodeAt(0) + x);
						// This needs to happen outside the loop or there will be a closure problem with creating the infowindows attached to the list click
						var currentMarker = markers[x];
						_this.listClick(currentMarker, storeStart, page);
					});

					// Handle clicks from the list
					$(document).on('click.' + prefix, _this.settings.listDiv + ' li', function () {
						var markerId = $(this).data('markerid');

						var selectedMarker = markers[markerId];

						// Focus on the list
						$(_this.settings.listDiv + ' li').removeClass('list-focus');
						$(_this.settings.listDiv + ' li[data-markerid=' + markerId + ']').addClass('list-focus');

						map.panTo(selectedMarker.getPosition());
						var listLoc = 'left';
						if (_this.settings.bounceMarker === true) {
							selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
							setTimeout(function () {
										selectedMarker.setAnimation(null);
										_this.createInfowindow(selectedMarker, listLoc, infowindow, storeStart, page);
									}, 700
							);
						}
						else {
							_this.createInfowindow(selectedMarker, listLoc, infowindow, storeStart, page);
						}
					});

					// Add the list li background colors
					$(_this.settings.listDiv + ' ul li:even').css('background', '#' + _this.settings.listColor1);
					$(_this.settings.listDiv + ' ul li:odd').css('background', '#' + _this.settings.listColor2);

				});
			});
		},

        /**
         * Taxonomy filtering
         */
        taxonomyFiltering: function() {
            var _this = this;

            // Set up the filters
            $.each(this.settings.taxonomyFilters, function (k) {
                filters[k] = [];
            });

            // Handle filter updates
            $('.bh-storelocator-filters-container').on('change.' + prefix, 'input, select', function (e) {
                e.stopPropagation();

                var filterId, filterContainer, filterKey;

                // Handle checkbox filters
                if ($(this).is('input[type="checkbox"]')) {
                    // First check for existing selections
                    _this.checkFilters();

                    filterId = $(this).val();
                    filterContainer = $(this).closest('.bh-storelocator-filters').attr('id');
                    filterKey = _this.getFilterKey(filterContainer);

                    if (filterKey) {
                        // Add or remove filters based on checkbox values
                        if ($(this).prop('checked')) {
                            // Add ids to the filter arrays as they are checked
                            filters[filterKey].push(filterId);
                            if ($('#' + _this.settings.mapDiv).hasClass('bh-storelocator-map-open') === true) {
                                _this.reset();
                                if ((olat) && (olng)) {
                                    _this.settings.mapSettings.zoom = 0;
                                    _this.beginMapping();
                                }
                                else {
                                    _this.mapping(originalData);
                                }
                            }
                        }
                        else {
                            // Remove ids from the filter arrays as they are unchecked
                            var filterIndex = filters[filterKey].indexOf(filterId);
                            if (filterIndex > -1) {
                                filters[filterKey].splice(filterIndex, 1);
                                if ($('#' + _this.settings.mapDiv).hasClass('bh-storelocator-map-open') === true) {
                                    _this.reset();
                                    if ((olat) && (olng)) {
                                        if (_this.countFilters() === 0) {
                                            _this.settings.mapSettings.zoom = originalZoom;
                                        }
                                        else {
                                            _this.settings.mapSettings.zoom = 0;
                                        }
                                        _this.beginMapping();
                                    }
                                    else {
                                        _this.mapping(originalData);
                                    }
                                }
                            }
                        }
                    }
                }
                // Handle select or radio filters
                else if ($(this).is('select') || $(this).is('input[type="radio"]')) {
                    // First check for existing selections
                    _this.checkFilters();

                    filterId = $(this).val();
                    filterContainer = $(this).closest('.bh-storelocator-filters').attr('id');
                    filterKey = _this.getFilterKey(filterContainer);

                    // Check for blank filter on select since default val could be empty
                    if (filterId) {
                        if (filterKey) {
                            filters[filterKey] = [filterId];
                            if ($('#' + _this.settings.mapDiv).hasClass('bh-storelocator-map-open') === true) {
                                _this.reset();
                                if ((olat) && (olng)) {
                                    _this.settings.mapSettings.zoom = 0;
                                    _this.beginMapping();
                                }
                                else {
                                    _this.mapping(originalData);
                                }
                            }
                        }
                    }
                    // Reset if the default option is selected
                    else {
                        if (filterKey) {
                            filters[filterKey] = [];
                        }
                        _this.reset();
                        if ((olat) && (olng)) {
                            _this.settings.mapSettings.zoom = originalZoom;
                            _this.beginMapping();
                        }
                        else {
                            _this.mapping(originalData);
                        }
                    }
                }
            });
        },

		/**
		 * Primary locator function runs after the templates are loaded
		 */
		locator: function () {
            // Do taxonomy filtering if set
            if (this.settings.taxonomyFilters !== null) {
                this.taxonomyFiltering();
            }

			// Add modal window divs if set
			if (this.settings.modalWindow === true) {
				$this.wrap('<div class="' + this.settings.overlayDiv + '"><div class="' + this.settings.modalWindowDiv + '"><div class="' + this.settings.modalContentDiv + '">');
				$('.' + this.settings.modalWindowDiv).prepend('<div class="' + this.settings.modalCloseIconDiv + '"><\/div>');
				$('.' + this.settings.overlayDiv).hide();
			}

			if (this.settings.slideMap === true) {
				// Let's hide the map container to begin
				$this.hide();
			}

			this.start();
			this.processFormInput();
		}

	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function (options) {
		this.each(function () {
			$this = $(this);
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});

		// chain jQuery functions
		return this;
	};


})(jQuery, window, document);