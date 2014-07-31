/*
 * storeLocator v1.4.9 - jQuery Google Maps Store Locator Plugin
 * (c) Copyright 2013, Bjorn Holine (http://www.bjornblog.com)
 * Released under the MIT license
 */

/* global define, window, document, Handlebars, google */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = "storeLocator";

	// Only allow for one instantiation of this script
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	// Variables used across multiple functions		
	var $this, listTemplate, infowindowTemplate, dataTypeRead, originalData, originalDataRequest, originalZoom, userInput, olat, olng, storeNum, directionsDisplay, directionsService;
	var featuredset, locationset, normalset, markers = [];
	var filters = {};
	var locationData = {};
	var GeoCodeCalc = {};

	// Create the defaults once. Do not change these settings in this file - settings should be overridden in the plugin call
	var defaults = {
		'mapDiv'                   : 'map',
		'listDiv'                  : 'bh-sl-loc-list',
		'formContainerDiv'         : 'bh-sl-form-container',
		'formID'                   : 'user-location',
		'inputID'                  : 'address',
		'regionID'                 : 'region',
		'mapSettings'              : {
			zoom     : 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		'pinColor'                 : 'fe7569', //TODO: New marker settings
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
		'overlayDiv'               : 'bh-sl-overlay',
		'modalWindowDiv'           : 'bh-sl-modal-window',
		'modalContentDiv'          : 'bh-sl-modal-content',
		'closeIconDiv'             : 'bh-sl-close-icon',
		'defaultLoc'               : false,
		'defaultLat'               : '',
		'defaultLng'               : '',
		'autoGeocode'              : false,
		'maxDistance'              : false,
		'maxDistanceID'            : 'maxdistance',
		'fullMapStart'             : false,
		'noForm'                   : false,
		'loading'                  : false, //TODO: Add loading back
		'loadingDiv'               : 'bh-sl-loading',
		'featuredLocations'        : false,
		'pagination'               : false,
		'locationsPerPage'         : 10,
		'inlineDirections'         : false,
		'nameSearch'               : false,
		'infowindowTemplatePath'   : 'templates/infowindow-description.html',
		'listTemplatePath'         : 'templates/location-list-description.html',
		'KMLinfowindowTemplatePath': 'templates/kml-infowindow-description.html',
		'KMLlistTemplatePath'      : 'templates/kml-location-list-description.html',
		'listTemplateID'           : null,
		'infowindowTemplateID'     : null,
		'taxonomyFilters'          : null,
		'callbackBeforeSend'       : null,
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
		 * Reset function
		 */
		reset: function () {
			locationset = [];
			featuredset = [];
			normalset = [];
			markers = [];
			$(document).off('click', '.' + this.settings.listDiv + ' li');
		},
		
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
			
			// Set up the directionsService if it's true
			if(this.settings.inlineDirections === true) {
				directionsDisplay = new google.maps.DirectionsRenderer();
				directionsService = new google.maps.DirectionsService();
				$('.' + this.settings.listDiv).prepend('<div class="bh-sl-directions-panel"></div>');
			}

			// Save the original zoom setting so it can be retrieved if taxonomy filtering resets it
			originalZoom = this.settings.mapSettings.zoom;
			
			// Add Handlebars helper for handling URL output
			Handlebars.registerHelper('niceURL', function(url) {
				return url.replace('https://', '').replace('http://', '');
			});
			
			if(this.settings.nameSearch === true){
				this.nameSearch();
			}
			
			// Load the templates and continue from there
			this.loadTemplates();
		},

		/**
		 * Load templates
		 */
		loadTemplates: function () {
			var source;
			var _this = this;
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
		 * Testing name search autocomplete - this is a separate search so adding separate AJAX request
		 */
		nameSearch: function() {
			
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
				$('.' + this.settings.modalWindowDiv).prepend('<div class="' + this.settings.closeIconDiv + '"></div>');
				$('.' + this.settings.overlayDiv).hide();
			}

			if (this.settings.slideMap === true) {
				// Let's hide the map container to begin
				$this.hide();
			}

			this.start();
			this.processFormInput();
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
				this.beginMapping(null);
			}
		},

		/**
		 * Process the form input
		 */
		processFormInput: function () {
			var _this = this;
			// ASP.net or regular submission?
			if (this.settings.noForm === true) {
				$(document).on('click', '.' + this.settings.formContainerDiv + ' button', function (e) {
					_this.getFormValues(e);
				});
				$(document).on('keyup', function (e) {
					if (e.keyCode === 13 && $('#' + _this.settings.inputID).is(':focus')) {
						_this.getFormValues(e);
					}
				});
			}
			else {
				$(document).on('submit', '#' + this.settings.formID, function (e) {
					_this.getFormValues(e);
				});
			}
		},

		/**
		 * AJAX data request
		 */
		getData: function (lat, lng, address) {
			var d = $.Deferred();
			
			// Before send callback
			if (this.settings.callbackBeforeSend) {
				this.settings.callbackBeforeSend.call(this);
			}

			// AJAX request
			$.ajax({
				type         : 'GET',
				url          : this.settings.dataLocation + (this.settings.dataType === 'jsonp' ? (this.settings.dataLocation.match(/\?/) ? '&' : '?') + 'callback=?' : ''),
				// Passing the lat, lng, and address with the AJAX request so they can optionally be used by back-end languages
				data: {
					'origLat' : lat,
					'origLng' : lng,
					'origAddress': address
				},
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
						_this.mapping(_this.settings.defaultLat, _this.settings.defaultLng, originAddress);
					} else {
						// Unable to geocode
						alert(_this.settings.addressErrorAlert);
					}
				});
			}

			// If show full map option is true
			if (this.settings.fullMapStart === true) {
				// Just do the mapping without an origin
				this.mapping();
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
			if ($('.bh-sl-pagination-container ol').length === 0) {
				if (currentPage === undefined) {
					currentPage = 0;
				}
				var pagesOutput = '';

				for (var p = 0; p < (locationset.length / this.settings.locationsPerPage); p++) {
					var n = p + 1;

					if (p === currentPage) {
						pagesOutput += '<li data-page="' + p + '" class="bh-sl-current">' + n + '</li>';
					}
					else {
						pagesOutput += '<li data-page="' + p + '">' + n + '</li>';
					}
				}
				//TODO: Target this better
				$('.bh-sl-pagination-container').append('<ol class="bh-sl-pagination">' + pagesOutput + '</ol>');
			}
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

			// Letter markers image
			var pinImage = new google.maps.MarkerImage('http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-b.png&text=' + letter + '&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48');

			// Create the markers
			if (this.settings.storeLimit === -1 || this.settings.storeLimit > 26) {
				marker = new google.maps.Marker({
					position : point,
					map      : map,
					draggable: false
				});
			}
			else {
				// Default dot marker
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
			return {
				location: [$.extend(locationData, {
					'markerid': markerId,
					'marker'  : indicator,
					'length'  : distLength,
					'origin'  : userInput
				})]
			};
		},

		/**
		 * Set up the list templates
		 *
		 * @param marker {object} Google Maps marker
		 * @param storeStart {number} optional first location on the current page
		 * @param page {number} optional current page
		 */
		listSetup: function (marker, storeStart, page) {
			// Define the location data
			var locations = this.defineLocationData(marker, storeStart, page);

			// Set up the list template with the location data
			var listHtml = listTemplate(locations);
			$('.' + this.settings.listDiv + ' ul').append(listHtml);
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
					$('.' + _this.settings.listDiv + ' li').removeClass('list-focus');
					var markerId = marker.get('id');
					$('.' + _this.settings.listDiv + ' li[data-markerid=' + markerId + ']').addClass('list-focus');

					// Scroll list to selected marker
					var container = $('.' + _this.settings.listDiv), scrollTo = $('.' + _this.settings.listDiv + ' li[data-markerid=' + markerId + ']');
					$('.' + _this.settings.listDiv).animate({
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
					_this.mapping(position.coords.latitude, position.coords.longitude, originAddress);
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
			this.mapping(olat, olng, userInput, maxDistance, newPage);
		},

		/**
		 * Get the address by marker ID
		 * 
		 * @param markerID {number} location ID
		 * @returns {string} Formatted address
		 */
		getAddressByMarker: function(markerID) {
			var formattedAddress = null;
			// Set up formatted address
			if(locationset[markerID].address){ formattedAddress += locationset[markerID].address + ' '; }
			if(locationset[markerID].address2){ formattedAddress += locationset[markerID].address2 + ' '; }
			if(locationset[markerID].city){ formattedAddress += locationset[markerID].city + ', '; }
			if(locationset[markerID].state){ formattedAddress += locationset[markerID].state + ' '; }
			if(locationset[markerID].postal){ formattedAddress += locationset[markerID].postal + ' '; }
			if(locationset[markerID].country){ formattedAddress += locationset[markerID].country + ' '; }
			
			return formattedAddress;
		},

		/**
		 * Clear the markers from the map
		 */
		clearMarkers: function() {
			for (var i = 0; i < locationset.length; i++) {
				markers[i].setMap(null);
			}
		},

		/**
		 * Handle inline direction requests
		 * 
		 * @param origin {string} origin address
		 * @param locID {number} location ID
		 * @param map
		 */
		directionsRequest: function(origin, locID, map) {
			var destination = this.getAddressByMarker(locID);

			if(destination) {
				// Hide the location list
				$('.' + this.settings.listDiv + ' ul').hide();
				// Remove the markers
				this.clearMarkers();

				// Directions request
				directionsDisplay.setMap(map);
				directionsDisplay.setPanel($('.bh-sl-directions-panel').get(0));

				var request = {
					origin: origin,
					destination: destination,
					travelMode: google.maps.TravelMode.DRIVING
				};
				directionsService.route(request, function(response, status) {
					if (status === google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(response);
					}
				});

				$('.' + this.settings.listDiv).prepend('<div class="bh-sl-close-directions-container"><div class="' + this.settings.closeIconDiv + '"></div></div>');
			}

			$(document).off('click', '.' + this.settings.listDiv + ' li .loc-directions a');
		},

		/**
		 * Close the directions panel and reset the map with the original locationset and zoom
		 */
		closeDirections: function() {
			// Remove the close icon, remove the directions, add the list back
			$('.bh-sl-close-directions-container').remove();
			$('.' + this.settings.listDiv + ' .adp').remove();
			$('.' + this.settings.listDiv + ' ul').fadeIn();
			
			this.reset();
			
			if ((olat) && (olng)) {
				if (this.countFilters() === 0) {
					this.settings.mapSettings.zoom = originalZoom;
				}
				else {
					this.settings.mapSettings.zoom = 0;
				}
				this.beginMapping(null);
			}

			$(document).off('click', '.' + this.settings.listDiv + ' .bh-sl-close-icon');
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

						// Run the mapping function
						_this.mapping(olat, olng, userInput, distance);
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
		mapping: function (orig_lat, orig_lng, origin, maxDistance, page) {
			var _this = this;
			var firstRun, marker, bounds, storeStart, storeNumToShow, myOptions;
			var i = 0;
			// Enable the visual refresh https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh
			google.maps.visualRefresh = true;

			// Setup the origin point
			var originPoint = new google.maps.LatLng(orig_lat, orig_lng);

			// Set the initial page to zero if not set
			if (page === undefined) {
				page = 0;
			}

			// Do the initial data request - doing this here so the lat/lng and address can be passed over and used if needed
			originalDataRequest = _this.getData(olat, olng, origin);

			// Save data separately so we can avoid multiple AJAX requests
			originalDataRequest.done(function (data) {
				// Success callback
				if (_this.settings.callbackSuccess) {
					_this.settings.callbackSuccess.call(this);
				}

				originalData = data;
			});

			/**
			 * Process the location data
			 */
			originalDataRequest.then(function (data) {
				// Callback
				if (_this.settings.callbackSuccess) {
					_this.settings.callbackSuccess.call(this);
				}

				// Set a variable for fullMapStart so we can detect the first run
				if (_this.settings.fullMapStart === true && $('#' + _this.settings.mapDiv).hasClass('bh-sl-map-open') === false) {
					firstRun = true;
				}
				else {
					_this.reset();
				}

				$('#' + _this.settings.mapDiv).addClass('bh-sl-map-open');

				// Process the location data depending on the data format type
				if (_this.settings.dataType === 'json' || _this.settings.dataType === 'jsonp') {
					// Process JSON
					$.each(data, function () {
						var key, value, locationData = {};

						// Parse each data variable
						for (key in this) {
							if (this.hasOwnProperty(key)) {
								value = this[key];

								locationData[key] = value;
							}
						}

						if (!locationData.distance) {
							locationData.distance = _this.geoCodeCalcCalcDistance(orig_lat, orig_lng, locationData.lat, locationData.lng, GeoCodeCalc.EarthRadius);
						}

						// Create the array
						if (_this.settings.maxDistance === true && firstRun !== true && maxDistance !== null) {
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
				else {
					// Process XML
					$(data).find(_this.settings.xmlElement).each(function () {
						var locationData = {};

						$.each(this.attributes, function (i, attrib) {
							locationData[attrib.name] = attrib.value;
						});

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

				// Sort the multi-dimensional array by distance
				_this.sortNumerically(locationset);

				// Featured locations filtering
				if (_this.settings.featuredLocations === true) {
					// Create array for featured locations
					featuredset = $.grep(locationset, function (val, i) {
						return val.featured === 'true';
					});

					// Create array for normal locations
					normalset = $.grep(locationset, function (val, i) {
						return val.featured !== 'true';
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
					// Close modal when close icon is clicked and when background overlay is clicked
					$(document).on('click', '.' + _this.settings.closeIconDiv + ', .' + _this.settings.overlayDiv, function () {
						_this.modalClose();
					});
					// Prevent clicks within the modal window from closing the entire thing
					$(document).on('click', '.' + _this.settings.modalWindowDiv, function (e) {
						e.stopPropagation();
					});
					// Close modal when escape key is pressed
					$(document).on('keyup', function (e) {
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
					bounds = new google.maps.LatLngBounds();
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

				var map = new google.maps.Map(document.getElementById(_this.settings.mapDiv), myOptions);
				// Load the map
				$this.data(_this.settings.mapDiv.replace('#'), map);

				// Create one infowindow to fill later
				var infowindow = new google.maps.InfoWindow();

				// Add origin marker if the setting is set
				if (_this.settings.originMarker === true && _this.settings.fullMapStart === false) {
					marker = new google.maps.Marker({
						position : originPoint,
						map      : map,
						icon     : 'https://maps.google.com/mapfiles/ms/icons/' + _this.settings.originpinColor + '-dot.png',
						draggable: false
					});
				}

				// Handle pagination
				$(document).on('click', '.bh-sl-pagination li', function () {
					// Remove the current class
					$('.bh-sl-pagination li').attr('class', '');

					// Add the current class
					$(this).addClass('bh-sl-current');

					// Run paginationChange
					_this.paginationChange($(this).attr('data-page'));
				});

				// Inline directions
				if(_this.settings.inlineDirections === true){
					// Open directions
					$(document).on('click', '.' + _this.settings.listDiv + ' li .loc-directions a', function (e) {
						e.preventDefault();
						var locID = $(this).closest('li').attr('data-markerid');
						_this.directionsRequest(origin, locID, map);
					});

					// Close directions
					$(document).on('click', '.' + _this.settings.listDiv + ' .bh-sl-close-icon', function () {
						_this.closeDirections();
					});
				}

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
				$('.' + _this.settings.listDiv + ' ul').empty();
				$(markers).each(function (x, marker) {
					var letter = String.fromCharCode('A'.charCodeAt(0) + x);
					var currentMarker = markers[x];
					_this.listSetup(currentMarker, storeStart, page);
				});

				// Handle clicks from the list
				$(document).on('click', '.' + _this.settings.listDiv + ' li', function () {
					var markerId = $(this).data('markerid');

					var selectedMarker = markers[markerId];

					// Focus on the list
					$('.' + _this.settings.listDiv + ' li').removeClass('list-focus');
					$('.' + _this.settings.listDiv + ' li[data-markerid=' + markerId + ']').addClass('list-focus');

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
				
				// Prevent bubbling from list content links
				$(document).on('click', '.' + _this.settings.listDiv + ' li a', function (e) {
					e.stopPropagation();
				});

				// Add the list li background colors
				$('.' + _this.settings.listDiv + ' ul li:even').css('background', '#' + _this.settings.listColor1);
				$('.' + _this.settings.listDiv + ' ul li:odd').css('background', '#' + _this.settings.listColor2);
				
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
				$('.bh-sl-filters-container').on('change', 'input, select', function (e) {
						e.stopPropagation();

						var filterId, filterContainer, filterKey;

						// Handle checkbox filters
						if ($(this).is('input[type="checkbox"]')) {
								// First check for existing selections
								_this.checkFilters();

								filterId = $(this).val();
								filterContainer = $(this).closest('.bh-sl-filters').attr('id');
								filterKey = _this.getFilterKey(filterContainer);

								if (filterKey) {
										// Add or remove filters based on checkbox values
										if ($(this).prop('checked')) {
												// Add ids to the filter arrays as they are checked
												filters[filterKey].push(filterId);
												if ($('#' + _this.settings.mapDiv).hasClass('bh-sl-map-open') === true) {
														_this.reset();
														if ((olat) && (olng)) {
																_this.settings.mapSettings.zoom = 0;
																_this.beginMapping();
														}
														else {
																_this.mapping();
														}
												}
										}
										else {
												// Remove ids from the filter arrays as they are unchecked
												var filterIndex = filters[filterKey].indexOf(filterId);
												if (filterIndex > -1) {
														filters[filterKey].splice(filterIndex, 1);
														if ($('#' + _this.settings.mapDiv).hasClass('bh-sl-map-open') === true) {
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
																		_this.mapping();
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
								filterContainer = $(this).closest('.bh-sl-filters').attr('id');
								filterKey = _this.getFilterKey(filterContainer);

								// Check for blank filter on select since default val could be empty
								if (filterId) {
										if (filterKey) {
												filters[filterKey] = [filterId];
												if ($('#' + _this.settings.mapDiv).hasClass('bh-sl-map-open') === true) {
														_this.reset();
														if ((olat) && (olng)) {
																_this.settings.mapSettings.zoom = 0;
																_this.beginMapping();
														}
														else {
																_this.mapping();
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
												_this.mapping();
										}
								}
						}
				});
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