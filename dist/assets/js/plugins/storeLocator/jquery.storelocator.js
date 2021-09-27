/*! jQuery Google Maps Store Locator - v3.1.5 - 2021-09-27
* http://www.bjornblog.com/web/jquery-store-locator-plugin
* Copyright (c) 2021 Bjorn Holine; Licensed MIT */

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'storeLocator';

	// Only allow for one instantiation of this script and make sure Google Maps API is included
	if (typeof $.fn[pluginName] !== 'undefined' || typeof google === 'undefined') {
		return;
	}

	// Variables used across multiple methods
	var $this, map, listTemplate, infowindowTemplate, dataTypeRead, originalOrigin, originalData, originalZoom, dataRequest, searchInput, addressInput, olat, olng, storeNum, directionsDisplay, directionsService, prevSelectedMarkerBefore, prevSelectedMarkerAfter, firstRun, reload;
	var featuredset = [], locationset = [], normalset = [], markers = [];
	var filters = {}, locationData = {}, GeoCodeCalc = {}, mappingObj = {};

    // Create the defaults once. DO NOT change these settings in this file - settings should be overridden in the plugin call
    var defaults = {
        'ajaxData'                   : null,
        'altDistanceNoResult'        : false,
        'autoComplete'               : false,
        'autoCompleteDisableListener': false,
        'autoCompleteOptions'        : {},
        'autoGeocode'                : false,
        'bounceMarker'               : true,
        'catMarkers'                 : null,
        'dataLocation'               : 'data/locations.json',
        'dataRaw'                    : null,
        'dataType'                   : 'json',
        'debug'                      : false,
        'defaultLat'                 : null,
        'defaultLng'                 : null,
        'defaultLoc'                 : false,
        'disableAlphaMarkers'        : false,
        'distanceAlert'              : 60,
        'dragSearch'                 : false,
        'exclusiveFiltering'         : false,
        'exclusiveTax'               : null,
        'featuredDistance'           : null,
        'featuredLocations'          : false,
        'fullMapStart'               : false,
        'fullMapStartBlank'          : false,
        'fullMapStartListLimit'      : false,
        'infoBubble'                 : null,
        'inlineDirections'           : false,
        'lengthUnit'                 : 'm',
        'listColor1'                 : '#ffffff',
        'listColor2'                 : '#eeeeee',
        'loading'                    : false,
        'locationsPerPage'           : 10,
        'mapSettings'                : {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom     : 12
        },
        'markerCluster'              : null,
        'markerImg'                  : null,
        'markerDim'                  : null,
        'maxDistance'                : false,
        'modal'                      : false,
        'nameAttribute'              : 'name',
        'nameSearch'                 : false,
        'noForm'                     : false,
        'openNearest'                : false,
        'originMarker'               : false,
        'originMarkerDim'            : null,
        'originMarkerImg'            : null,
        'pagination'                 : false,
        'querystringParams'          : false,
        'selectedMarkerImg'          : null,
        'selectedMarkerImgDim'       : null,
        'sessionStorage'             : false,
        'slideMap'                   : true,
        'sortBy'                     : null,
        'storeLimit'                 : 26,
        'taxonomyFilters'            : null,
        'visibleMarkersList'         : false,
        'xmlElement'                 : 'marker',
        // HTML elements
        'addressID'                  : 'bh-sl-address',
        'closeIcon'                  : 'bh-sl-close-icon',
        'formContainer'              : 'bh-sl-form-container',
        'formID'                     : 'bh-sl-user-location',
        'geocodeID'                  : null,
        'lengthSwapID'               : 'bh-sl-length-swap',
        'loadingContainer'           : 'bh-sl-loading',
        'locationList'               : 'bh-sl-loc-list',
        'mapID'                      : 'bh-sl-map',
        'maxDistanceID'              : 'bh-sl-maxdistance',
        'modalContent'               : 'bh-sl-modal-content',
        'modalWindow'                : 'bh-sl-modal-window',
        'orderID'                    : 'bh-sl-order',
        'overlay'                    : 'bh-sl-overlay',
        'regionID'                   : 'bh-sl-region',
        'searchID'                   : 'bh-sl-search',
        'sortID'                     : 'bh-sl-sort',
        'taxonomyFiltersContainer'   : 'bh-sl-filters-container',
        // Templates
        'infowindowTemplatePath'     : 'assets/js/plugins/storeLocator/templates/infowindow-description.html',
        'listTemplatePath'           : 'assets/js/plugins/storeLocator/templates/location-list-description.html',
        'KMLinfowindowTemplatePath'  : 'assets/js/plugins/storeLocator/templates/kml-infowindow-description.html',
        'KMLlistTemplatePath'        : 'assets/js/plugins/storeLocator/templates/kml-location-list-description.html',
        'listTemplateID'             : null,
        'infowindowTemplateID'       : null,
        // Callbacks
        'callbackAutoGeoSuccess'     : null,
        'callbackBeforeSend'         : null,
        'callbackCloseDirections'    : null,
        'callbackCreateMarker'       : null,
        'callbackDirectionsRequest'  : null,
        'callbackFilters'            : null,
        'callbackFormVals'           : null,
        'callbackGeocodeRestrictions': null,
        'callbackJsonp'              : null,
        'callbackListClick'          : null,
        'callbackMapSet'             : null,
        'callbackMarkerClick'        : null,
        'callbackModalClose'         : null,
        'callbackModalOpen'          : null,
        'callbackModalReady'         : null,
        'callbackNearestLoc'         : null,
        'callbackNoResults'          : null,
        'callbackNotify'             : null,
        'callbackOrder'              : null,
        'callbackPageChange'         : null,
        'callbackRegion'             : null,
        'callbackSorting'            : null,
        'callbackSuccess'            : null,
        // Language options
        'addressErrorAlert'          : 'Unable to find address',
        'autoGeocodeErrorAlert'      : 'Automatic location detection failed. Please fill in your address or zip code.',
        'distanceErrorAlert'         : 'Unfortunately, our closest location is more than ',
        'kilometerLang'              : 'kilometer',
        'kilometersLang'             : 'kilometers',
        'mileLang'                   : 'mile',
        'milesLang'                  : 'miles',
        'noResultsTitle'             : 'No results',
        'noResultsDesc'              : 'No locations were found with the given criteria. Please modify your selections or input.',
        'nextPage'                   : 'Next &raquo;',
        'prevPage'                   : '&laquo; Prev'
    };

	// Plugin constructor
	function Plugin(element, options) {
		$this = $(element);
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {

		/**
		 * Init function
		 */
		init: function () {
			var _this = this;
			this.writeDebug('init');
			// Calculate geocode distance functions
			if (this.settings.lengthUnit === 'km') {
				// Kilometers
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

			// Add directions panel if enabled
			if (this.settings.inlineDirections === true) {
				$('.' + this.settings.locationList).prepend('<div class="bh-sl-directions-panel"></div>');
			}

			// Save the original zoom setting so it can be retrieved if taxonomy filtering resets it
			originalZoom = this.settings.mapSettings.zoom;

			// Add Handlebars helper for handling URL output
			Handlebars.registerHelper('niceURL', function(url) {
				if (url) {
					return url.replace('https://', '').replace('http://', '');
				}
			});

			// Do taxonomy filtering if set
			if (this.settings.taxonomyFilters !== null) {
				this.taxonomyFiltering();
			}

			// Do sorting and ordering if set.
			this.sorting();
			this.order();

			// Add modal window divs if set
			if (this.settings.modal === true) {
				// Clone the filters if there are any so they can be used in the modal
				if (this.settings.taxonomyFilters !== null) {
					// Clone the filters
					$('.' + this.settings.taxonomyFiltersContainer).clone(true, true).prependTo($this);
				}

				$this.wrap('<div class="' + this.settings.overlay + '"><div class="' + this.settings.modalWindow + '"><div class="' + this.settings.modalContent + '">');
				$('.' + this.settings.modalWindow).prepend('<div class="' + this.settings.closeIcon + '"></div>');
				$('.' + this.settings.overlay).hide();
			}

			// Set up Google Places autocomplete if it's set to true
			if (this.settings.autoComplete === true) {
				var searchInput = document.getElementById(this.settings.addressID);
				var autoPlaces = new google.maps.places.Autocomplete(searchInput, this.settings.autoCompleteOptions);

				// Add listener when autoComplete selection changes.
				if (this.settings.autoComplete === true && this.settings.autoCompleteDisableListener !== true) {
					autoPlaces.addListener('place_changed', function(e) {
						_this.processForm(e);
					});
				}
			}

			// Load the templates and continue from there
			this._loadTemplates();
		},

		/**
		 * Destroy
		 * Note: The Google map is not destroyed here because Google recommends using a single instance and reusing it
		 * (it's not really supported)
		 */
		destroy: function () {
			this.writeDebug('destroy');
			// Reset
			this.reset();
			var $mapDiv = $('#' + this.settings.mapID);

			// Remove marker event listeners
			if (markers.length) {
				for(var i = 0; i <= markers.length; i++) {
					google.maps.event.removeListener(markers[i]);
				}
			}

			// Remove markup
			$('.' + this.settings.locationList + ' ul').empty();
			if ($mapDiv.hasClass('bh-sl-map-open')) {
				$mapDiv.empty().removeClass('bh-sl-map-open');
			}

			// Remove modal markup
			if (this.settings.modal === true) {
				$('. ' + this.settings.overlay).remove();
			}

			// Remove map style from container
			$mapDiv.attr('style', '');

			// Hide map container
			$this.hide();
			// Remove data
			$.removeData($this.get(0));
			// Remove namespaced events
			$(document).off(pluginName);
			// Unbind plugin
			$this.unbind();
		},

		/**
		 * Reset function
		 * This method clears out all the variables and removes events. It does not reload the map.
		 */
		reset: function () {
			this.writeDebug('reset');
			locationset = [];
			featuredset = [];
			normalset = [];
			markers = [];
			firstRun = false;
			$(document).off('click.'+pluginName, '.' + this.settings.locationList + ' li');

			if ( $('.' + this.settings.locationList + ' .bh-sl-close-directions-container').length ) {
				$('.bh-sl-close-directions-container').remove();
			}

			if (this.settings.inlineDirections === true) {
				// Remove directions panel if it's there
				var $adp = $('.' + this.settings.locationList + ' .adp');
				if ( $adp.length > 0 ) {
					$adp.remove();
					$('.' + this.settings.locationList + ' ul').fadeIn();
				}
				$(document).off('click', '.' + this.settings.locationList + ' li .loc-directions a');
			}

			if (this.settings.pagination === true) {
				$(document).off('click.'+pluginName, '.bh-sl-pagination li');
			}
		},

		/**
		 * Reset the form filters
		 */
		formFiltersReset: function () {
			this.writeDebug('formFiltersReset');
			if (this.settings.taxonomyFilters === null) {
				return;
			}

			var $inputs = $('.' + this.settings.taxonomyFiltersContainer + ' input'),
				$selects = $('.' + this.settings.taxonomyFiltersContainer + ' select');

			if ( typeof($inputs) !== 'object') {
				return;
			}

			// Loop over the input fields
			$inputs.each(function() {
				if ($(this).is('input[type="checkbox"]') || $(this).is('input[type="radio"]')) {
					$(this).prop('checked',false);
				}
			});

			// Loop over select fields
			$selects.each(function() {
				$(this).prop('selectedIndex',0);
			});
		},

		/**
		 * Reload everything
		 * This method does a reset of everything and reloads the map as it would first appear.
		 */
		mapReload: function() {
			this.writeDebug('mapReload');
			this.reset();
			reload = true;

			if ( this.settings.taxonomyFilters !== null ) {
				this.formFiltersReset();
				this.taxonomyFiltersInit();
			}

			if ((olat) && (olng)) {
				this.settings.mapSettings.zoom = originalZoom;
				this.processForm();
			}
			else {
				this.mapping(mappingObj);
			}
		},

		/**
		 * Notifications
		 * Some errors use alert by default. This is overridable with the callbackNotify option
		 *
		 * @param notifyText {string} the notification message
		 */
		notify: function (notifyText) {
			this.writeDebug('notify',notifyText);
			if (this.settings.callbackNotify) {
				this.settings.callbackNotify.call(this, notifyText);
			}
			else {
				alert(notifyText);
			}
		},

		/**
		 * Distance calculations
		 */
		geoCodeCalcToRadian: function (v) {
			this.writeDebug('geoCodeCalcToRadian',v);
			return v * (Math.PI / 180);
		},
		geoCodeCalcDiffRadian: function (v1, v2) {
			this.writeDebug('geoCodeCalcDiffRadian',arguments);
			return this.geoCodeCalcToRadian(v2) - this.geoCodeCalcToRadian(v1);
		},
		geoCodeCalcCalcDistance: function (lat1, lng1, lat2, lng2, radius) {
			this.writeDebug('geoCodeCalcCalcDistance',arguments);
			return radius * 2 * Math.asin(Math.min(1, Math.sqrt(( Math.pow(Math.sin((this.geoCodeCalcDiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(this.geoCodeCalcToRadian(lat1)) * Math.cos(this.geoCodeCalcToRadian(lat2)) * Math.pow(Math.sin((this.geoCodeCalcDiffRadian(lng1, lng2)) / 2.0), 2.0) ))));
		},

		/**
		 * Check for query string
		 *
		 * @param param {string} query string parameter to test
		 *
		 * @returns {string} query string value
		 */
		getQueryString: function(param) {
			this.writeDebug('getQueryString',param);
			if(param) {
				param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
				var regex = new RegExp('[\\?&]' + param + '=([^&#]*)'),
					results = regex.exec(location.search);
				return (results === null) ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
			}
		},

		/**
		 * Get google.maps.Map instance
		 *
		 * @returns {Object} google.maps.Map instance
		 */
		getMap: function() {
			return this.map;
		},

		/**
		 * Load templates via Handlebars templates in /templates or inline via IDs - private
		 */
		_loadTemplates: function () {
			this.writeDebug('_loadTemplates');
			var source;
			var _this = this;
			var templateError = '<div class="bh-sl-error">Error: Could not load plugin templates. Check the paths and ensure they have been uploaded. Paths will be wrong if you do not run this from a web server.</div>';
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
					// KML templates not loaded
					$('.' + _this.settings.formContainer).append(templateError);
					throw new Error('Could not load storeLocator plugin templates');
				});
			}
			// Handle script tag template method
			else if (this.settings.listTemplateID !== null && this.settings.infowindowTemplateID !== null) {
				// Infowindows
				infowindowTemplate = Handlebars.compile($('#' + this.settings.infowindowTemplateID).html());

				// Locations list
				listTemplate = Handlebars.compile($('#' + this.settings.listTemplateID).html());

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
					// JSON/XML templates not loaded
					$('.' + _this.settings.formContainer).append(templateError);
					throw new Error('Could not load storeLocator plugin templates');
				});
			}
		},

		/**
		 * Primary locator function runs after the templates are loaded
		 */
		locator: function () {
			this.writeDebug('locator');
			if (this.settings.slideMap === true) {
				// Let's hide the map container to begin
				$this.hide();
			}

			this._start();
			this._formEventHandler();
		},

		/**
		 * Form event handler setup - private
		 */
		_formEventHandler: function () {
			this.writeDebug('_formEventHandler');
			var _this = this;
			// ASP.net or regular submission?
			if (this.settings.noForm === true) {
				$(document).on('click.'+pluginName, '.' + this.settings.formContainer + ' button', function (e) {
					_this.processForm(e);
				});
				$(document).on('keydown.'+pluginName, function (e) {
					if (e.keyCode === 13 && $('#' + _this.settings.addressID).is(':focus')) {
						_this.processForm(e);
					}
				});
			}
			else {
				$(document).on('submit.'+pluginName, '#' + this.settings.formID, function (e) {
					_this.processForm(e);
				});
			}

			// Reset button trigger
			if ($('.bh-sl-reset').length && $('#' + this.settings.mapID).length) {
				$(document).on('click.' + pluginName, '.bh-sl-reset', function () {
					_this.mapReload();
				});
			}
		},

		/**
		 * AJAX data request - private
		 *
		 * @param lat {number} latitude
		 * @param lng {number} longitude
		 * @param address {string} street address
		 * @param geocodeData {object} full Google geocode results object
		 * @param map (object} Google Maps object.
		 *
		 * @returns {Object} deferred object
		 */
		_getData: function (lat, lng, address, geocodeData, map) {
			this.writeDebug('_getData',arguments);
			var _this = this,
				northEast = '',
				southWest = '',
				formattedAddress = '';

			// Define extra geocode result info
			if (typeof geocodeData !== 'undefined' && typeof geocodeData.geometry.bounds !== 'undefined') {
				formattedAddress = geocodeData.formatted_address;
				northEast = JSON.stringify( geocodeData.geometry.bounds.getNorthEast() );
				southWest = JSON.stringify( geocodeData.geometry.bounds.getSouthWest() );
			}

			// Before send callback
			if (this.settings.callbackBeforeSend) {
				this.settings.callbackBeforeSend.call(this, lat, lng, address, formattedAddress, northEast, southWest, map);
			}

			// Raw data
			if(_this.settings.dataRaw !== null) {
				// XML
				if( dataTypeRead === 'xml' ) {
					return $.parseXML(_this.settings.dataRaw);
				}

				// JSON
				else if (dataTypeRead === 'json') {
					if (Array.isArray && Array.isArray(_this.settings.dataRaw)) {
						return _this.settings.dataRaw;
					}
					else if (typeof _this.settings.dataRaw === 'string') {
						return JSON.parse(_this.settings.dataRaw);
					}
					else {
						return [];
					}

				}
			}
			// Remote data
			else {
				var d = $.Deferred();

				// Loading
				if (this.settings.loading === true) {
					$('.' + this.settings.formContainer).append('<div class="' + this.settings.loadingContainer +'"></div>');
				}

				// Data to pass with the AJAX request
				var ajaxData = {
					'origLat' : lat,
					'origLng' : lng,
					'origAddress': address,
					'formattedAddress': formattedAddress,
					'boundsNorthEast' : northEast,
					'boundsSouthWest' : southWest
				};

				// Set up extra object for custom extra data to be passed with the AJAX request
				if (this.settings.ajaxData !== null && typeof this.settings.ajaxData === 'object') {
					$.extend(ajaxData, this.settings.ajaxData);
				}

				// AJAX request
				$.ajax({
					type         : 'GET',
					url          : this.settings.dataLocation + (this.settings.dataType === 'jsonp' ? (this.settings.dataLocation.match(/\?/) ? '&' : '?') + 'callback=?' : ''),
					// Passing the lat, lng, address, formatted address and bounds with the AJAX request so they can optionally be used by back-end languages
					data         : ajaxData,
					dataType     : dataTypeRead,
					jsonpCallback: (this.settings.dataType === 'jsonp' ? this.settings.callbackJsonp : null)
				}).done(function(p) {
					d.resolve(p);

					// Loading remove
					if (_this.settings.loading === true) {
						$('.' + _this.settings.formContainer + ' .' + _this.settings.loadingContainer).remove();
					}
				}).fail(d.reject);
				return d.promise();
			}
		},

		/**
		 * Checks for default location, full map, and HTML5 geolocation settings - private
		 */
		_start: function () {
			this.writeDebug('_start');
			var _this = this,
					doAutoGeo = this.settings.autoGeocode,
					latlng;

			// Full map blank start
			if (_this.settings.fullMapStartBlank !== false) {
				var $mapDiv = $('#' + _this.settings.mapID);
				$mapDiv.addClass('bh-sl-map-open');
				var myOptions = _this.settings.mapSettings;
				myOptions.zoom = _this.settings.fullMapStartBlank;

				latlng = new google.maps.LatLng(this.settings.defaultLat, this.settings.defaultLng);
				myOptions.center = latlng;

				// Create the map
				_this.map = new google.maps.Map(document.getElementById(_this.settings.mapID), myOptions);

				// Re-center the map when the browser is re-sized
				google.maps.event.addDomListener(window, 'resize', function() {
					var center = _this.map.getCenter();
					google.maps.event.trigger(_this.map, 'resize');
					_this.map.setCenter(center);
				});

				// Only do this once
				_this.settings.fullMapStartBlank = false;
				myOptions.zoom = originalZoom;
			}
			else {
				// If a default location is set
				if (this.settings.defaultLoc === true) {
					this.defaultLocation();
				}

				// If there is already have a value in the address bar
				if ($.trim($('#' + this.settings.addressID).val()) !== ''){
					_this.writeDebug('Using Address Field');
					_this.processForm(null);
					doAutoGeo = false; // No need for additional processing
				}
				// If show full map option is true
				else if (this.settings.fullMapStart === true) {
					if ((this.settings.querystringParams === true && this.getQueryString(this.settings.addressID)) || (this.settings.querystringParams === true && this.getQueryString(this.settings.searchID)) || (this.settings.querystringParams === true && this.getQueryString(this.settings.maxDistanceID))) {
						_this.writeDebug('Using Query String');
						this.processForm(null);
						doAutoGeo = false; // No need for additional processing
					}
					else {
						this.mapping(null);
					}
				}
			}

			// HTML5 auto geolocation API option
			if (this.settings.autoGeocode === true && doAutoGeo === true) {
				_this.writeDebug('Auto Geo');

				_this.htmlGeocode();
			}

			// HTML5 geolocation API button option
			if (this.settings.autoGeocode !== null) {
				_this.writeDebug('Button Geo');

				$(document).on('click.'+pluginName, '#' + this.settings.geocodeID, function () {
					_this.htmlGeocode();
				});
			}
		},

		/**
		 * Geocode function used for auto geocode setting and geocodeID button
		 */
		htmlGeocode: function() {
			this.writeDebug('htmlGeocode',arguments);
			var _this = this;

			if (_this.settings.sessionStorage === true && window.sessionStorage && window.sessionStorage.getItem('myGeo')){
				_this.writeDebug('Using Session Saved Values for GEO');
				_this.autoGeocodeQuery(JSON.parse(window.sessionStorage.getItem('myGeo')));
				return false;
			}
			else if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					_this.writeDebug('Current Position Result');
					// To not break autoGeocodeQuery then we create the obj to match the geolocation format
					var pos = {
						coords: {
							latitude : position.coords.latitude,
							longitude: position.coords.longitude,
							accuracy : position.coords.accuracy
						}
					};

					// Have to do this to get around scope issues
					if (_this.settings.sessionStorage === true && window.sessionStorage) {
						window.sessionStorage.setItem('myGeo',JSON.stringify(pos));
					}

					// Callback
					if (_this.settings.callbackAutoGeoSuccess) {
						_this.settings.callbackAutoGeoSuccess.call(this, pos);
					}

					_this.autoGeocodeQuery(pos);
				}, function(error){
					_this._autoGeocodeError(error);
				});
			}
		},

		/**
		 * Geocode function used to geocode the origin (entered location)
		 */
		googleGeocode: function (thisObj) {
			thisObj.writeDebug('googleGeocode',arguments);
			var geocoder = new google.maps.Geocoder();
			this.geocode = function (request, callbackFunction) {
				geocoder.geocode(request, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						var result = {};
						result.latitude = results[0].geometry.location.lat();
						result.longitude = results[0].geometry.location.lng();
						result.geocodeResult = results[0];
						callbackFunction(result);
					} else {
						callbackFunction(null);
						throw new Error('Geocode was not successful for the following reason: ' + status);
					}
				});
			};
		},

		/**
		 * Reverse geocode to get address for automatic options needed for directions link
		 */
		reverseGoogleGeocode: function (thisObj) {
			thisObj.writeDebug('reverseGoogleGeocode',arguments);
			var geocoder = new google.maps.Geocoder();
			this.geocode = function (request, callbackFunction) {
				geocoder.geocode(request, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							var result = {};
							result.address = results[0].formatted_address;
							result.fullResult = results[0];
							callbackFunction(result);
						}
					} else {
						callbackFunction(null);
						throw new Error('Reverse geocode was not successful for the following reason: ' + status);
					}
				});
			};
		},

		/**
		 * Rounding function used for distances
		 *
		 * @param num {number} the full number
		 * @param dec {number} the number of digits to show after the decimal
		 *
		 * @returns {number}
		 */
		roundNumber: function (num, dec) {
			this.writeDebug('roundNumber',arguments);
			return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
		},

		/**
		 * Checks to see if the object is empty. Using this instead of $.isEmptyObject for legacy browser support
		 *
		 * @param obj {Object} the object to check
		 *
		 * @returns {boolean}
		 */
		isEmptyObject: function (obj) {
			this.writeDebug('isEmptyObject',arguments);
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		},

		/**
		 * Checks to see if all the property values in the object are empty
		 *
		 * @param obj {Object} the object to check
		 *
		 * @returns {boolean}
		 */
		hasEmptyObjectVals: function (obj) {
			this.writeDebug('hasEmptyObjectVals',arguments);
				var objTest = true;

				for(var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (obj[key] !== '' && obj[key].length !== 0) {
							objTest = false;
						}
					}
				}

				return objTest;
		},

		/**
		 * Modal window close function
		 */
		modalClose: function () {
			this.writeDebug('modalClose');
			// Callback
			if (this.settings.callbackModalClose) {
				this.settings.callbackModalClose.call(this);
			}

			// Reset the filters
			filters = {};

			// Undo category selections
			$('.' + this.settings.overlay + ' select').prop('selectedIndex', 0);
			$('.' + this.settings.overlay + ' input').prop('checked', false);

			// Hide the modal
			$('.' + this.settings.overlay).hide();
		},

		/**
		 * Create the location variables - private
		 *
		 * @param loopcount {number} current marker id
		 */
		_createLocationVariables: function (loopcount) {
			this.writeDebug('_createLocationVariables',arguments);
			var value;
			locationData = {};

			for (var key in locationset[loopcount]) {
				if (locationset[loopcount].hasOwnProperty(key)) {
					value = locationset[loopcount][key];

					if (key === 'distance' || key === 'altdistance') {
						value = this.roundNumber(value, 2);
					}

					locationData[key] = value;
				}
			}
		},

		/**
		 * Location alphabetical sorting function
		 *
		 * @param locationsarray {array} locationset array
		 */
		sortAlpha: function(locationsarray) {
			this.writeDebug('sortAlpha',arguments);
			var property = (this.settings.sortBy.hasOwnProperty('prop') && typeof this.settings.sortBy.prop !== 'undefined') ?  this.settings.sortBy.prop : 'name';

			if (this.settings.sortBy.hasOwnProperty('order') && this.settings.sortBy.order.toString() === 'desc') {
				locationsarray.sort(function (a, b) {
					return b[property].toLowerCase().localeCompare(a[property].toLowerCase());
				});
			} else {
				locationsarray.sort(function (a, b) {
					return a[property].toLowerCase().localeCompare(b[property].toLowerCase());
				});
			}
		},

		/**
		 * Location date sorting function
		 *
		 * @param locationsarray {array} locationset array
		 */
		sortDate: function(locationsarray) {
			this.writeDebug('sortDate',arguments);
			var property = (this.settings.sortBy.hasOwnProperty('prop') && typeof this.settings.sortBy.prop !== 'undefined') ?  this.settings.sortBy.prop : 'date';

			if (this.settings.sortBy.hasOwnProperty('order') && this.settings.sortBy.order.toString() === 'desc') {
				locationsarray.sort(function (a, b) {
					return new Date(b[property]).getTime() - new Date(a[property]).getTime();
				});
			} else {
				locationsarray.sort(function (a, b) {
					return new Date(a[property]).getTime() - new Date(b[property]).getTime();
				});
			}
		},

		/**
		 * Location distance sorting function
		 *
		 * @param locationsarray {array} locationset array
		 */
		sortNumerically: function (locationsarray) {
			this.writeDebug('sortNumerically',arguments);
			var property = (
				this.settings.sortBy !== null &&
				this.settings.sortBy.hasOwnProperty('prop') &&
				typeof this.settings.sortBy.prop !== 'undefined'
			) ?  this.settings.sortBy.prop : 'distance';

			if (this.settings.sortBy !== null && this.settings.sortBy.hasOwnProperty('order') && this.settings.sortBy.order.toString() === 'desc') {
				locationsarray.sort(function (a, b) {
					return ((b[property] < a[property]) ? -1 : ((b[property] > a[property]) ? 1 : 0));
				});
			} else {
				locationsarray.sort(function (a, b) {
					return ((a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0));
				});
			}
		},

		/**
		 * Alternative sorting setup
		 *
		 * @param locationsarray {array} locationset array
		 */
		sortCustom: function (locationsarray) {
			this.writeDebug('sortCustom',arguments);

			// Alphabetically, date, or numeric
			if (this.settings.sortBy.hasOwnProperty('method') && this.settings.sortBy.method.toString() === 'alpha') {
				this.sortAlpha(locationsarray);
			} else if (this.settings.sortBy.hasOwnProperty('method') && this.settings.sortBy.method.toString() === 'date') {
				this.sortDate(locationsarray);
			} else {
				this.sortNumerically(locationsarray);
			}
		},

		/**
		 * Run the matching between regular expression filters and string value
		 *
		 * @param filter {array} One or multiple filters to apply
		 * @param val {string} Value to compare
		 * @param inclusive {boolean} Inclusive (default) or exclusive
		 *
		 * @returns {boolean}
		 */
		filterMatching: function(filter, val, inclusive) {
			this.writeDebug('inclusiveFilter',arguments);
			inclusive = (typeof inclusive !== 'undefined') ?  inclusive : true;
			var applyFilters;

			// Undefined check.
			if (typeof val === 'undefined') {
				return false;
			}

			// Modify the join depending on inclusive (AND) vs exclusive (OR).
			if ( true === inclusive ) {
				applyFilters = filter.join('');
			} else {
				applyFilters = filter.join('|');
			}

			if ((new RegExp(applyFilters, 'i').test(val.replace(/([.*+?^=!:${}()|\[\]\/\\]|&\s+)/g, '')))) {
				return true;
			}

			return false;
		},

		/**
		 * Filter the data with Regex
		 *
		 * @param data {array} data array to check for filter values
		 * @param filters {Object} taxonomy filters object
		 *
		 * @returns {boolean}
		 */
		filterData: function (data, filters) {
			this.writeDebug('filterData', arguments);
			var filterTest = true;

			for (var k in filters) {
				if (filters.hasOwnProperty(k)) {
					var testResults = [];

					for (var l = 0; l < filters[k].length; l++) {

						// Exclusive filtering
						if (this.settings.exclusiveFiltering === true || (this.settings.exclusiveTax !== null && Array.isArray(this.settings.exclusiveTax) && this.settings.exclusiveTax.indexOf(k) !== -1)) {
							testResults[l] = this.filterMatching(filters[k], data[k], false);
						}
						// Inclusive filtering
						else {
							testResults[l] = this.filterMatching(filters[k], data[k]);
						}
					}

					if (testResults.indexOf(true) === -1) {
						filterTest = false;
					}
				}
			}

			return filterTest;
		},

		/**
		 * Build pagination numbers and next/prev links - private
		 *
		 * @param currentPage {number}
		 * @param totalPages {number}
		 *
		 * @returns {string}
		 */
		_paginationOutput: function(currentPage, totalPages) {
			this.writeDebug('_paginationOutput',arguments);

			currentPage = parseFloat(currentPage);
			var output = '';
			var nextPage = currentPage + 1;
			var prevPage = currentPage - 1;

			// Previous page
			if ( currentPage > 0 ) {
				output += '<li class="bh-sl-next-prev" data-page="' + prevPage + '">' + this.settings.prevPage + '</li>';
			}

			// Add the numbers
			for (var p = 0; p < Math.ceil(totalPages); p++) {
				var n = p + 1;

				if (p === currentPage) {
					output += '<li class="bh-sl-current" data-page="' + p + '">' + n + '</li>';
				}
				else {
					output += '<li data-page="' + p + '">' + n + '</li>';
				}
			}

			// Next page
			if ( nextPage < totalPages ) {
				output += '<li class="bh-sl-next-prev" data-page="' + nextPage + '">' + this.settings.nextPage + '</li>';
			}

			return output;
		},

		/**
		 * Set up the pagination pages
		 *
		 * @param currentPage {number} optional current page
		 */
		paginationSetup: function (currentPage) {
			this.writeDebug('paginationSetup',arguments);
			var pagesOutput = '';
			var totalPages;
			var $paginationList = $('.bh-sl-pagination-container .bh-sl-pagination');

			// Total pages
			if ( this.settings.storeLimit === -1 || locationset.length < this.settings.storeLimit ) {
				totalPages = locationset.length / this.settings.locationsPerPage;
			} else {
				totalPages = this.settings.storeLimit / this.settings.locationsPerPage;
			}

			// Current page check
			if (typeof currentPage === 'undefined') {
				currentPage = 0;
			}

			// Initial pagination setup
			if ($paginationList.length === 0) {

				pagesOutput = this._paginationOutput(currentPage, totalPages);
			}
			// Update pagination on page change
			else {
				// Remove the old pagination
				$paginationList.empty();

				// Add the numbers
				pagesOutput = this._paginationOutput(currentPage, totalPages);
			}

			$paginationList.append(pagesOutput);
		},

		/**
		 * Marker image setup
		 *
		 * @param markerUrl {string} path to marker image
		 * @param markerWidth {number} width of marker
		 * @param markerHeight {number} height of marker
		 *
		 * @returns {Object} Google Maps icon object
		 */
		markerImage: function (markerUrl, markerWidth, markerHeight) {
			this.writeDebug('markerImage',arguments);
			var markerImg;

			// User defined marker dimensions
			if (typeof markerWidth !== 'undefined' && typeof markerHeight !== 'undefined') {
				markerImg = {
					url: markerUrl,
					size: new google.maps.Size(markerWidth, markerHeight),
					scaledSize: new google.maps.Size(markerWidth, markerHeight)
				};
			}
			// Default marker dimensions: 32px x 32px
			else {
				markerImg = {
					url: markerUrl,
					size: new google.maps.Size(32, 32),
					scaledSize: new google.maps.Size(32, 32)
				};
			}

			return markerImg;
		},

		/**
		 * Map marker setup
		 *
		 * @param point {Object} LatLng of current location
		 * @param name {string} location name
		 * @param address {string} location address
		 * @param letter {string} optional letter used for front-end identification and correlation between list and
		 *     points
		 * @param map {Object} the Google Map
		 * @param category {string} location category/categories
		 *
		 * @returns {Object} Google Maps marker
		 */
		createMarker: function (point, name, address, letter, map, category) {
			this.writeDebug('createMarker',arguments);
			var marker, markerImg, letterMarkerImg;
			var categories = [];

			// Custom multi-marker image override (different markers for different categories
			if (this.settings.catMarkers !== null) {
				if (typeof category !== 'undefined') {
					// Multiple categories
					if (category.indexOf(',') !== -1) {
						// Break the category variable into an array if there are multiple categories for the location
						categories = category.split(',');
						// With multiple categories the color will be determined by the last matched category in the data
						for(var i = 0; i < categories.length; i++) {
							if (categories[i] in this.settings.catMarkers) {
								markerImg = this.markerImage(this.settings.catMarkers[categories[i]][0], parseInt(this.settings.catMarkers[categories[i]][1]), parseInt(this.settings.catMarkers[categories[i]][2]));
							}
						}
					}
					// Single category
					else {
						if (category in this.settings.catMarkers) {
							markerImg = this.markerImage(this.settings.catMarkers[category][0], parseInt(this.settings.catMarkers[category][1]), parseInt(this.settings.catMarkers[category][2]));
						}
					}
				}
			}

			// Custom single marker image override
			if (this.settings.markerImg !== null) {
				if (this.settings.markerDim === null) {
					markerImg = this.markerImage(this.settings.markerImg);
				}
				else {
					markerImg = this.markerImage(this.settings.markerImg, this.settings.markerDim.width, this.settings.markerDim.height);
				}
			}

			// Marker setup
			if (this.settings.callbackCreateMarker) {
				// Marker override callback
				marker = this.settings.callbackCreateMarker.call(this, map, point, letter, category);
			}
			else {
				// Create the default markers
				if (this.settings.disableAlphaMarkers === true || this.settings.storeLimit === -1 || this.settings.storeLimit > 26 || this.settings.catMarkers !== null || this.settings.markerImg !== null || (this.settings.fullMapStart === true && firstRun === true && (isNaN(this.settings.fullMapStartListLimit) || this.settings.fullMapStartListLimit > 26 || this.settings.fullMapStartListLimit === -1))) {
					marker = new google.maps.Marker({
						position : point,
						map      : map,
						draggable: false,
						icon: markerImg // Reverts to default marker if nothing is passed
					});
				}
				else {
					// Letter markers image
					letterMarkerImg = {
						url: 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-b.png&text=' + letter + '&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48'
					};

					// Letter markers
					marker = new google.maps.Marker({
						position : point,
						map      : map,
						icon     : letterMarkerImg,
						draggable: false
					});
				}
			}

			return marker;
		},

		/**
		 * Define the location data for the templates - private
		 *
		 * @param currentMarker {Object} Google Maps marker
		 * @param storeStart {number} optional first location on the current page
		 * @param page {number} optional current page
		 *
		 * @returns {Object} extended location data object
		 */
		_defineLocationData: function (currentMarker, storeStart, page) {
			this.writeDebug('_defineLocationData',arguments);
			var indicator = '';
			this._createLocationVariables(currentMarker.get('id'));

			var altDistLength,
				distLength;

			if (locationData.distance <= 1) {
				if (this.settings.lengthUnit === 'km') {
					distLength = this.settings.kilometerLang;
					altDistLength = this.settings.mileLang;
				}
				else {
					distLength = this.settings.mileLang;
					altDistLength = this.settings.kilometerLang;
				}
			}
			else {
				if (this.settings.lengthUnit === 'km') {
					distLength = this.settings.kilometersLang;
					altDistLength = this.settings.milesLang;
				}
				else {
					distLength = this.settings.milesLang;
					altDistLength = this.settings.kilometersLang;
				}
			}

			// Set up alpha character
			var markerId = currentMarker.get('id');
			// Use dot markers instead of alpha if there are more than 26 locations
			if (this.settings.disableAlphaMarkers === true || this.settings.storeLimit === -1 || this.settings.storeLimit > 26 || (this.settings.fullMapStart === true && firstRun === true && (isNaN(this.settings.fullMapStartListLimit) || this.settings.fullMapStartListLimit > 26 || this.settings.fullMapStartListLimit === -1))) {
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
					'markerid' : markerId,
					'marker'   : indicator,
					'altlength': altDistLength,
					'length'   : distLength,
					'origin'   : originalOrigin
				})]
			};
		},

		/**
		 * Set up the list templates
		 *
		 * @param marker {Object} Google Maps marker
		 * @param storeStart {number} optional first location on the current page
		 * @param page {number} optional current page
		 */
		listSetup: function (marker, storeStart, page) {
			this.writeDebug('listSetup',arguments);
			// Define the location data
			var locations = this._defineLocationData(marker, storeStart, page);

			// Set up the list template with the location data
			var listHtml = listTemplate(locations);
			$('.' + this.settings.locationList + ' > ul').append(listHtml);
		},

		/**
		 * Change the selected marker image
		 *
		 * @param marker {Object} Google Maps marker object
		 */
		changeSelectedMarker: function (marker) {
			var markerImg;

			// Reset the previously selected marker
			if ( typeof prevSelectedMarkerAfter !== 'undefined' ) {
				prevSelectedMarkerAfter.setIcon( prevSelectedMarkerBefore );
			}

			// Change the selected marker icon
			if (this.settings.selectedMarkerImgDim === null) {
				markerImg = this.markerImage(this.settings.selectedMarkerImg);
			} else {
				markerImg = this.markerImage(this.settings.selectedMarkerImg, this.settings.selectedMarkerImgDim.width, this.settings.selectedMarkerImgDim.height);
			}

			// Save the marker before switching it
			prevSelectedMarkerBefore = marker.icon;

			marker.setIcon( markerImg );

			// Save the marker to a variable so it can be reverted when another marker is clicked
			prevSelectedMarkerAfter = marker;
		},

		/**
		 * Create the infowindow
		 *
		 * @param marker {Object} Google Maps marker object
		 * @param location {string} indicates if the list or a map marker was clicked
		 * @param infowindow Google Maps InfoWindow constructor
		 * @param storeStart {number}
		 * @param page {number}
		 */
		createInfowindow: function (marker, location, infowindow, storeStart, page) {
			this.writeDebug('createInfowindow',arguments);
			var _this = this;
			// Define the location data
			var locations = this._defineLocationData(marker, storeStart, page);

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
					var markerId = marker.get('id');
					var $selectedLocation = $('.' + _this.settings.locationList + ' li[data-markerid=' + markerId + ']');

					if ($selectedLocation.length > 0) {
						// Marker click callback
						if (_this.settings.callbackMarkerClick) {
							_this.settings.callbackMarkerClick.call(this, marker, markerId, $selectedLocation, locationset[markerId], _this.map);
						}

						$('.' + _this.settings.locationList + ' li').removeClass('list-focus');
						$selectedLocation.addClass('list-focus');

						// Scroll list to selected marker
						var $container = $('.' + _this.settings.locationList);
						$container.animate({
							scrollTop: $selectedLocation.offset().top - $container.offset().top + $container.scrollTop()
						});
					}

					// Custom selected marker override
					if (_this.settings.selectedMarkerImg !== null) {
						_this.changeSelectedMarker(marker);
					}
				});
			}
		},

		/**
		 * HTML5 geocoding function for automatic location detection
		 *
		 * @param position {Object} coordinates
		 */
		autoGeocodeQuery: function (position) {
			this.writeDebug('autoGeocodeQuery',arguments);
			var _this = this,
				distance = null,
				$distanceInput = $('#' + this.settings.maxDistanceID),
				originAddress;

			// Query string parameters
			if (this.settings.querystringParams === true) {
				// Check for distance query string parameters
				if (this.getQueryString(this.settings.maxDistanceID)){
					distance = this.getQueryString(this.settings.maxDistanceID);

					if ($distanceInput.val() !== '') {
						distance = $distanceInput.val();
					}
				}
				else{
					// Get the distance if set
					if (this.settings.maxDistance === true) {
						distance = $distanceInput.val() || '';
					}
				}
			}
			else {
				// Get the distance if set
				if (this.settings.maxDistance === true) {
					distance = $distanceInput.val() || '';
				}
			}

			// The address needs to be determined for the directions link
			var r = new this.reverseGoogleGeocode(this);
			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			r.geocode({'latLng': latlng}, function (data) {
				if (data !== null) {
					originAddress = addressInput = data.address;
					olat = mappingObj.lat = position.coords.latitude;
					olng = mappingObj.lng = position.coords.longitude;
					mappingObj.origin = originAddress;
					mappingObj.distance = distance;
					_this.mapping(mappingObj);

					// Fill in the search box.
					if (typeof originAddress !== 'undefined') {
						$('#' + _this.settings.addressID).val(originAddress);
					}
				} else {
					// Unable to geocode
					_this.notify(_this.settings.addressErrorAlert);
				}
			});
		},

		/**
		 * Handle autoGeocode failure - private
		 *
		 */
		_autoGeocodeError: function () {
			this.writeDebug('_autoGeocodeError');
			// If automatic detection doesn't work show an error
			this.notify(this.settings.autoGeocodeErrorAlert);
		},

		/**
		 * Default location method
		 */
		defaultLocation: function() {
			this.writeDebug('defaultLocation');
			var _this = this,
				distance = null,
				$distanceInput = $('#' + this.settings.maxDistanceID),
				originAddress;

			// Query string parameters
			if (this.settings.querystringParams === true) {
				// Check for distance query string parameters
				if (this.getQueryString(this.settings.maxDistanceID)){
					distance = this.getQueryString(this.settings.maxDistanceID);

					if ($distanceInput.val() !== '') {
						distance = $distanceInput.val();
					}
				}
				else {
					// Get the distance if set
					if (this.settings.maxDistance === true) {
						distance = $distanceInput.val() || '';
					}
				}
			}
			else {
				// Get the distance if set
				if (this.settings.maxDistance === true) {
					distance = $distanceInput.val() || '';
				}
			}

			// The address needs to be determined for the directions link
			var r = new this.reverseGoogleGeocode(this);
			var latlng = new google.maps.LatLng(this.settings.defaultLat, this.settings.defaultLng);
			r.geocode({'latLng': latlng}, function (data) {
				if (data !== null) {
					originAddress = addressInput = data.address;
					olat = mappingObj.lat = _this.settings.defaultLat;
					olng = mappingObj.lng = _this.settings.defaultLng;
					mappingObj.distance = distance;
					mappingObj.origin = originAddress;
					_this.mapping(mappingObj);
				} else {
					// Unable to geocode
					_this.notify(_this.settings.addressErrorAlert);
				}
			});
		},

		/**
		 * Change the page
		 *
		 * @param newPage {number} page to change to
		 */
		paginationChange: function (newPage) {
			this.writeDebug('paginationChange',arguments);

			// Page change callback
			if (this.settings.callbackPageChange) {
				this.settings.callbackPageChange.call(this, newPage);
			}

			mappingObj.page = newPage;
			this.mapping(mappingObj);
		},

		/**
		 * Get the address by marker ID
		 *
		 * @param markerID {number} location ID
		 *
		 * @returns {string} formatted address
		 */
		getAddressByMarker: function(markerID) {
			this.writeDebug('getAddressByMarker',arguments);
			var formattedAddress = "";
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
			this.writeDebug('clearMarkers');
			var locationsLimit = null;

			if (locationset.length < this.settings.storeLimit) {
				locationsLimit = locationset.length;
			}
			else {
				locationsLimit = this.settings.storeLimit;
			}

			for (var i = 0; i < locationsLimit; i++) {
				markers[i].setMap(null);
			}
		},

		/**
		 * Handle inline direction requests
		 *
		 * @param origin {string} origin address
		 * @param locID {number} location ID
		 * @param map {Object} Google Map
		 */
		directionsRequest: function(origin, locID, map) {
			this.writeDebug('directionsRequest',arguments);

			// Directions request callback
			if (this.settings.callbackDirectionsRequest) {
				this.settings.callbackDirectionsRequest.call(this, origin, locID, map, locationset[locID]);
			}

			var destination = this.getAddressByMarker(locID);

			if (destination) {
				// Hide the location list
				$('.' + this.settings.locationList + ' ul').hide();
				// Remove the markers
				this.clearMarkers();

				// Clear the previous directions request
				if (directionsDisplay !== null && typeof directionsDisplay !== 'undefined') {
					directionsDisplay.setMap(null);
					directionsDisplay = null;
				}

				directionsDisplay = new google.maps.DirectionsRenderer();
				directionsService = new google.maps.DirectionsService();

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

				$('.' + this.settings.locationList).prepend('<div class="bh-sl-close-directions-container"><div class="' + this.settings.closeIcon + '"></div></div>');
			}

			$(document).off('click', '.' + this.settings.locationList + ' li .loc-directions a');
		},

		/**
		 * Close the directions panel and reset the map with the original locationset and zoom
		 */
		closeDirections: function() {
			this.writeDebug('closeDirections');

			// Close directions callback
			if (this.settings.callbackCloseDirections) {
				this.settings.callbackCloseDirections.call(this);
			}

			// Remove the close icon, remove the directions, add the list back
			this.reset();

			if ((olat) && (olng)) {
				if (this.countFilters() === 0) {
					this.settings.mapSettings.zoom = originalZoom;
				}
				else {
					this.settings.mapSettings.zoom = 0;
				}
				this.processForm(null);
			}

			$(document).off('click.'+pluginName, '.' + this.settings.locationList + ' .bh-sl-close-icon');
		},

		/**
		 * Handle length unit swap
		 *
		 * @param $lengthSwap
		 */
		lengthUnitSwap: function($lengthSwap) {
			this.writeDebug('lengthUnitSwap',arguments);

			if ($lengthSwap.val() === 'alt-distance') {
				$('.' + this.settings.locationList + ' .loc-alt-dist').show();
				$('.' + this.settings.locationList + ' .loc-default-dist').hide();
			} else if ($lengthSwap.val() === 'default-distance') {
				$('.' + this.settings.locationList + ' .loc-default-dist').show();
				$('.' + this.settings.locationList + ' .loc-alt-dist').hide();
			}
		},

		/**
		 * Process the form values and/or query string
		 *
		 * @param e {Object} event
		 */
		processForm: function (e) {
			this.writeDebug('processForm',arguments);
			var _this = this,
				distance = null,
				geocodeRestrictions = {},
				$addressInput = $('#' + this.settings.addressID),
				$searchInput = $('#' + this.settings.searchID),
				$distanceInput = $('#' + this.settings.maxDistanceID),
				region = '';

			// Stop the form submission
			if (typeof e !== 'undefined' && e !== null) {
				e.preventDefault();
			}

			// Blur any form field to hide mobile keyboards.
			$('.' + _this.settings.formContainer +' input, .' + _this.settings.formContainer + ' select').blur();

			// Query string parameters
			if (this.settings.querystringParams === true) {
				// Check for query string parameters
				if (this.getQueryString(this.settings.addressID) || this.getQueryString(this.settings.searchID) || this.getQueryString(this.settings.maxDistanceID)) {
					addressInput = this.getQueryString(this.settings.addressID);
					searchInput = this.getQueryString(this.settings.searchID);
					distance = this.getQueryString(this.settings.maxDistanceID);

					// The form should override the query string parameters
					if ($addressInput.val() !== '') {
						addressInput = $addressInput.val();
					}
					if ($searchInput.val() !== '') {
						searchInput = $searchInput.val();
					}
					if ($distanceInput.val() !== '') {
						distance = $distanceInput.val();
					}
				}
				else {
					// Get the user input and use it
					addressInput = $addressInput.val() || '';
					searchInput = $searchInput.val() || '';

					// Get the distance if set
					if (this.settings.maxDistance === true) {
						distance = $distanceInput.val() || '';
					}
				}
			}
			else {
				// Get the user input and use it
				addressInput = $addressInput.val() || '';
				searchInput = $searchInput.val() || '';
				// Get the distance if set
				if (this.settings.maxDistance === true) {
					distance = $distanceInput.val() || '';
				}
			}

			// Region
			if (this.settings.callbackRegion) {
				// Region override callback
				region = this.settings.callbackRegion.call(this, addressInput, searchInput, distance);
			} else {
				// Region setting
				region = $('#' + this.settings.regionID).val();
			}

			// Form values callback
			if (this.settings.callbackFormVals) {
				this.settings.callbackFormVals.call(this, addressInput, searchInput, distance, region);
			}

			// Add component restriction if the region has been set.
			if (typeof region !== 'undefined') {
				geocodeRestrictions = {
					country: region
				};
			}

			// Component restriction value via callback.
			if (typeof this.settings.callbackGeocodeRestrictions === 'function') {
				// Component restriction override callback
				geocodeRestrictions = this.settings.callbackGeocodeRestrictions.call(this, addressInput, searchInput, distance);
			}

			if (addressInput === '' && searchInput === '' && this.settings.autoGeocode !== true) {
				this._start();
			}
			else if (addressInput !== '') {
				// Check for existing name search and remove if address input is blank.
				if (searchInput === '' && filters.hasOwnProperty('name')) {
					delete filters.name;
				}

				// Geocode the origin if needed
				if (typeof originalOrigin !== 'undefined' && typeof olat !== 'undefined' && typeof olng !== 'undefined' && (addressInput === originalOrigin)) {
					// Run the mapping function
					mappingObj.lat = olat;
					mappingObj.lng = olng;
					mappingObj.origin = addressInput;
					mappingObj.name = searchInput;
					mappingObj.distance = distance;
					_this.mapping(mappingObj);
				}
				else {
					var g = new this.googleGeocode(this);
					g.geocode({
						address: addressInput,
						componentRestrictions: geocodeRestrictions,
						region: region
					}, function (data) {
						if (data !== null) {
							olat = data.latitude;
							olng = data.longitude;

							// Run the mapping function
							mappingObj.lat = olat;
							mappingObj.lng = olng;
							mappingObj.origin = addressInput;
							mappingObj.name = searchInput;
							mappingObj.distance = distance;
							mappingObj.geocodeResult = data.geocodeResult;
							_this.mapping(mappingObj);
						} else {
							// Unable to geocode
							_this.notify(_this.settings.addressErrorAlert);
						}
					});
				}
			}
			else if (searchInput !== '') {
				// Check for existing origin and remove if address input is blank.
				if ( addressInput === '' ) {
					delete mappingObj.origin;
				}

				mappingObj.name = searchInput;
				_this.mapping(mappingObj);
			}
			else if (this.settings.autoGeocode === true) {
				// Run the mapping function
				mappingObj.lat = olat;
				mappingObj.lng = olng;
				mappingObj.origin = addressInput;
				mappingObj.name = searchInput;
				mappingObj.distance = distance;
				_this.mapping(mappingObj);
			}
		},

		/**
		 * Checks distance of each location and sets up the locationset array
		 *
		 * @param data {Object} location data object
		 * @param lat {number} origin latitude
		 * @param lng {number} origin longitude
		 * @param origin {string} origin address
		 * @param maxDistance {number} maximum distance if set
		 */
		locationsSetup: function (data, lat, lng, origin, maxDistance) {
			this.writeDebug('locationsSetup',arguments);
			if (typeof origin !== 'undefined') {
				if (!data.distance) {
					data.distance = this.geoCodeCalcCalcDistance(lat, lng, data.lat, data.lng, GeoCodeCalc.EarthRadius);

					// Alternative distance length unit
					if (this.settings.lengthUnit === 'm') {
						// Miles to kilometers
						data.altdistance = parseFloat(data.distance)*1.609344;
					} else if (this.settings.lengthUnit === 'km') {
						// Kilometers to miles
						data.altdistance = parseFloat(data.distance)/1.609344;
					}
				}
			}

			// Create the array
			if (this.settings.maxDistance === true && typeof maxDistance !== 'undefined' && maxDistance !== null) {
				if (data.distance <= maxDistance) {
					locationset.push( data );
				}
				else {
					return;
				}
			}
			else if (this.settings.maxDistance === true && this.settings.querystringParams === true && typeof maxDistance !== 'undefined' && maxDistance !== null) {
				if (data.distance <= maxDistance) {
					locationset.push( data );
				}
				else {
					return;
				}
			}
			else {
				locationset.push( data );
			}
		},

		/**
		 * Set up front-end sorting functionality
		 */
		sorting: function() {
			this.writeDebug('sorting',arguments);
			var _this = this,
				$mapDiv = $('#' + _this.settings.mapID),
				$sortSelect = $('#' + _this.settings.sortID);

			if ($sortSelect.length === 0) {
				return;
			}

			$sortSelect.on('change.'+pluginName, function (e) {
				e.stopPropagation();

				// Reset pagination.
				if (_this.settings.pagination === true) {
					_this.paginationChange(0);
				}

				var sortMethod,
					sortVal;

				sortMethod = (typeof $(this).find(':selected').attr('data-method') !== 'undefined') ?  $(this).find(':selected').attr('data-method') : 'distance';
				sortVal = $(this).val();

				_this.settings.sortBy.method = sortMethod;
				_this.settings.sortBy.prop = sortVal;

				// Callback
				if (_this.settings.callbackSorting) {
					_this.settings.callbackSorting.call(this, _this.settings.sortBy);
				}

				if ($mapDiv.hasClass('bh-sl-map-open')) {
					_this.mapping(mappingObj);
				}
			});
		},

		/**
		 * Set up front-end ordering functionality - this ties in to sorting and that has to be enabled for this to
		 * work.
		 */
		order: function() {
			this.writeDebug('order',arguments);
			var _this = this,
				$mapDiv = $('#' + _this.settings.mapID),
				$orderSelect = $('#' + _this.settings.orderID);

			if ($orderSelect.length === 0) {
				return;
			}

			$orderSelect.on('change.'+pluginName, function (e) {
				e.stopPropagation();

				// Reset pagination.
				if (_this.settings.pagination === true) {
					_this.paginationChange(0);
				}

				_this.settings.sortBy.order = $(this).val();

				// Callback
				if (_this.settings.callbackOrder) {
					_this.settings.callbackOrder.call(this, _this.settings.order);
				}

				if ($mapDiv.hasClass('bh-sl-map-open')) {
					_this.mapping(mappingObj);
				}
			});
		},

		/**
		 * Count the selected filters
		 *
		 * @returns {number}
		 */
		countFilters: function () {
			this.writeDebug('countFilters');
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
		 * Find the existing checked boxes for each checkbox filter - private
		 *
		 * @param key {string} object key
		 */
		_existingCheckedFilters: function(key) {
			this.writeDebug('_existingCheckedFilters',arguments);
			$('#' + this.settings.taxonomyFilters[key] + ' input[type=checkbox]').each(function () {
				if ($(this).prop('checked')) {
					var filterVal = $(this).val();

					// Only add the taxonomy id if it doesn't already exist
					if (typeof filterVal !== 'undefined' && filterVal !== '' && filters[key].indexOf(filterVal) === -1) {
						filters[key].push(filterVal);
					}
				}
			});
		},

		/**
		 * Find the existing selected value for each select filter - private
		 *
		 * @param key {string} object key
		 */
		_existingSelectedFilters: function(key) {
			this.writeDebug('_existingSelectedFilters',arguments);
			$('#' + this.settings.taxonomyFilters[key] + ' select').each(function () {
				var filterVal = $(this).val();

				// Only add the taxonomy id if it doesn't already exist
				if (typeof filterVal !== 'undefined' && filterVal !== '' &&  filters[key].indexOf(filterVal) === -1) {
					filters[key] = [filterVal];
				}
			});
		},

		/**
		 * Find the existing selected value for each radio button filter - private
		 *
		 * @param key {string} object key
		 */
		_existingRadioFilters: function(key) {
			this.writeDebug('_existingRadioFilters',arguments);
			$('#' + this.settings.taxonomyFilters[key] + ' input[type=radio]').each(function () {
				if ($(this).prop('checked')) {
					var filterVal = $(this).val();

					// Only add the taxonomy id if it doesn't already exist
					if (typeof filterVal !== 'undefined' && filterVal !== '' && filters[key].indexOf(filterVal) === -1) {
						filters[key] = [filterVal];
					}
				}
			});
		},

		/**
		 * Check for existing filter selections
		 */
		checkFilters: function () {
			this.writeDebug('checkFilters');
			for(var key in this.settings.taxonomyFilters) {

				if (this.settings.taxonomyFilters.hasOwnProperty(key)) {
					// Find the existing checked boxes for each checkbox filter
					this._existingCheckedFilters(key);

					// Find the existing selected value for each select filter
					this._existingSelectedFilters(key);

					// Find the existing value for each radio button filter
					this._existingRadioFilters(key);
				}
			}
		},

		/**
		 * Select the indicated values from query string parameters.
		 *
		 * @param taxonomy {string} Current taxonomy.
		 * @param value {array} Query string array values.
		 */
		selectQueryStringFilters: function( taxonomy, value ) {
			this.writeDebug('selectQueryStringFilters', arguments);

			var $taxGroupContainer = $('#' + this.settings.taxonomyFilters[taxonomy]);

			// Handle checkboxes.
			if ( $taxGroupContainer.find('input[type="checkbox"]').length ) {

				for ( var i = 0; i < value.length; i++ ) {
					$taxGroupContainer.find('input:checkbox[value="' + value[i] + '"]').prop('checked', true);
				}
			}

			// Handle select fields.
			if ( $taxGroupContainer.find('select').length ) {
				// Only expecting one value for select fields.
				$taxGroupContainer.find('option[value="' + value[0] + '"]').prop('selected', true);
			}

			// Handle radio buttons.
			if ( $taxGroupContainer.find('input[type="radio"]').length ) {
				// Only one value for radio button.
				$taxGroupContainer.find('input:radio[value="' + value[0] + '"]').prop('checked', true);
			}
		},

		/**
		 * Check query string parameters for filter values.
		 */
		checkQueryStringFilters: function () {
			this.writeDebug('checkQueryStringFilters',arguments);

			// Loop through the filters.
			for(var key in filters) {
				if (filters.hasOwnProperty(key)) {
					var filterVal = this.getQueryString(key);

					// Check for multiple values separated by comma.
					if ( filterVal.indexOf( ',' ) !== -1 ) {
						filterVal = filterVal.split( ',' );
					}

					// Only add the taxonomy id if it doesn't already exist
					if (typeof filterVal !== 'undefined' && filterVal !== '' && filters[key].indexOf(filterVal) === -1) {
						if ( Array.isArray( filterVal ) ) {
							filters[key] = filterVal;
						} else {
							filters[key] = [filterVal];
						}
					}

					// Select the filters indicated in the query string.
					if ( filters[key].length ) {
						this.selectQueryStringFilters( key, filters[key] );
					}
				}
			}

		},

		/**
		 * Get the filter key from the taxonomyFilter setting
		 *
		 * @param filterContainer {string} ID of the changed filter's container
		 */
		getFilterKey: function (filterContainer) {
			this.writeDebug('getFilterKey',arguments);
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
		 * Initialize or reset the filters object to its original state
		 */
		taxonomyFiltersInit: function () {
			this.writeDebug('taxonomyFiltersInit');

			// Set up the filters
			for(var key in this.settings.taxonomyFilters) {
				if (this.settings.taxonomyFilters.hasOwnProperty(key)) {
					filters[key] = [];
				}
			}
		},

		/**
		 * Taxonomy filtering
		 */
		taxonomyFiltering: function() {
			this.writeDebug('taxonomyFiltering');
			var _this = this;

			// Set up the filters
			_this.taxonomyFiltersInit();

			// Check query string for taxonomy parameter keys.
			_this.checkQueryStringFilters();

			// Handle filter updates
			$('.' + this.settings.taxonomyFiltersContainer).on('change.'+pluginName, 'input, select', function (e) {
				e.stopPropagation();

				var filterVal, filterContainer, filterKey;

				// Reset pagination.
				if (_this.settings.pagination === true) {
					_this.paginationChange(0);
				}

				// Handle checkbox filters
				if ($(this).is('input[type="checkbox"]')) {
					// First check for existing selections
					_this.checkFilters();

					filterVal = $(this).val();
					filterContainer = $(this).closest('.bh-sl-filters').attr('id');
					filterKey = _this.getFilterKey(filterContainer);

					if (filterKey) {
						// Add or remove filters based on checkbox values
						if ($(this).prop('checked')) {
							// Add ids to the filter arrays as they are checked
							if (filters[filterKey].indexOf(filterVal) === -1) {
								filters[filterKey].push(filterVal);
							}

							if ($('#' + _this.settings.mapID).hasClass('bh-sl-map-open') === true) {
								if ((olat) && (olng)) {
									_this.settings.mapSettings.zoom = 0;
									_this.processForm();
								}
								else {
									_this.mapping(mappingObj);
								}
							}
						}
						else {
							// Remove ids from the filter arrays as they are unchecked
							var filterIndex = filters[filterKey].indexOf(filterVal);
							if (filterIndex > -1) {
								filters[filterKey].splice(filterIndex, 1);
								if ($('#' + _this.settings.mapID).hasClass('bh-sl-map-open') === true) {
									if ((olat) && (olng)) {
										if (_this.countFilters() === 0) {
											_this.settings.mapSettings.zoom = originalZoom;
										}
										else {
											_this.settings.mapSettings.zoom = 0;
										}
										_this.processForm();
									}
									else {
										_this.mapping(mappingObj);
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

					filterVal = $(this).val();
					filterContainer = $(this).closest('.bh-sl-filters').attr('id');
					filterKey = _this.getFilterKey(filterContainer);

					// Check for blank filter on select since default val could be empty
					if (filterVal) {
						if (filterKey) {
							filters[filterKey] = [filterVal];
							if ($('#' + _this.settings.mapID).hasClass('bh-sl-map-open') === true) {
								if ((olat) && (olng)) {
									_this.settings.mapSettings.zoom = 0;
									_this.processForm();
								}
								else {
									_this.mapping(mappingObj);
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
							_this.processForm();
						}
						else {
							_this.mapping(mappingObj);
						}
					}
				}
			});
		},

		/**
		 * Updates the location list to reflect the markers that are displayed on the map
		 *
		 * @param markers {Object} Map markers
		 * @param map {Object} Google map
		 */
		checkVisibleMarkers: function(markers, map) {
			this.writeDebug('checkVisibleMarkers',arguments);
			var _this = this;
			var locations, listHtml;

			// Empty the location list
			$('.' + this.settings.locationList + ' ul').empty();

			// Set up the new list
			$(markers).each(function(x, marker){
				if (map.getBounds().contains(marker.getPosition())) {
					// Define the location data
					_this.listSetup(marker, 0, 0);

					// Set up the list template with the location data
					listHtml = listTemplate(locations);
					$('.' + _this.settings.locationList + ' > ul').append(listHtml);
				}
			});

			// Re-add the list background colors
			$('.' + this.settings.locationList + ' ul li:even').css('background', this.settings.listColor1);
			$('.' + this.settings.locationList + ' ul li:odd').css('background', this.settings.listColor2);
		},

		/**
		 * Performs a new search when the map is dragged to a new position
		 *
		 * @param map {Object} Google map
		 */
		dragSearch: function(map) {
			this.writeDebug('dragSearch',arguments);
			var newCenter = map.getCenter(),
				newCenterCoords,
				_this = this;

			// Save the new zoom setting
			this.settings.mapSettings.zoom = map.getZoom();

			olat = mappingObj.lat = newCenter.lat();
			olng = mappingObj.lng = newCenter.lng();

			// Determine the new origin addresss
			var newAddress = new this.reverseGoogleGeocode(this);
			newCenterCoords = new google.maps.LatLng(mappingObj.lat, mappingObj.lng);
			newAddress.geocode({'latLng': newCenterCoords}, function (data) {
				if (data !== null) {
					mappingObj.origin = addressInput = data.address;
					_this.mapping(mappingObj);
				} else {
					// Unable to geocode
					_this.notify(_this.settings.addressErrorAlert);
				}
			});
		},

		/**
		 * Handle no results
		 */
		emptyResult: function() {
			this.writeDebug('emptyResult',arguments);
			var center,
				locList =  $('.' + this.settings.locationList + ' ul'),
				myOptions = this.settings.mapSettings,
				noResults;

			// Create the map
			this.map = new google.maps.Map(document.getElementById(this.settings.mapID), myOptions);

			// Callback
			if (this.settings.callbackNoResults) {
				this.settings.callbackNoResults.call(this, this.map, myOptions);
			}

			// Empty the location list
			locList.empty();

			// Append the no results message
			noResults = $('<li><div class="bh-sl-noresults-title">' + this.settings.noResultsTitle +  '</div><br><div class="bh-sl-noresults-desc">' + this.settings.noResultsDesc + '</li>').hide().fadeIn();
			locList.append(noResults);

			// Center on the original origin or 0,0 if not available
			if ((olat) && (olng)) {
				center = new google.maps.LatLng(olat, olng);
			} else {
				center = new google.maps.LatLng(0, 0);
			}

			this.map.setCenter(center);

			if (originalZoom) {
				this.map.setZoom(originalZoom);
			}
		},


		/**
		 * Origin marker setup
		 *
		 * @param map {Object} Google map
		 * @param origin {string} Origin address
		 * @param originPoint {Object} LatLng of origin point
		 */
		originMarker: function(map, origin, originPoint) {
			this.writeDebug('originMarker',arguments);

			if (this.settings.originMarker !== true) {
				return;
			}

			var marker,
				originImg = '';

			if (typeof origin !== 'undefined') {
				if (this.settings.originMarkerImg !== null) {
					if (this.settings.originMarkerDim === null) {
						originImg = this.markerImage(this.settings.originMarkerImg);
					}
					else {
						originImg = this.markerImage(this.settings.originMarkerImg, this.settings.originMarkerDim.width, this.settings.originMarkerDim.height);
					}
				}
				else {
					originImg = {
						url: 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png'
					};
				}

				marker = new google.maps.Marker({
					position : originPoint,
					map      : map,
					icon     : originImg,
					draggable: false
				});
			}
		},

		/**
		 * Modal window setup
		 */
		modalWindow: function() {
			this.writeDebug('modalWindow');

			if (this.settings.modal !== true) {
				return;
			}

			var _this = this;

			// Callback
			if (_this.settings.callbackModalOpen) {
				_this.settings.callbackModalOpen.call(this);
			}

			// Pop up the modal window
			$('.' + _this.settings.overlay).fadeIn();
			// Close modal when close icon is clicked and when background overlay is clicked
			$(document).on('click.'+pluginName, '.' + _this.settings.closeIcon + ', .' + _this.settings.overlay, function () {
				_this.modalClose();
			});
			// Prevent clicks within the modal window from closing the entire thing
			$(document).on('click.'+pluginName, '.' + _this.settings.modalWindow, function (e) {
				e.stopPropagation();
			});
			// Close modal when escape key is pressed
			$(document).on('keyup.'+pluginName, function (e) {
				if (e.keyCode === 27) {
					_this.modalClose();
				}
			});
		},

		/**
		 * Open and select the location closest to the origin
		 *
		 * @param nearestLoc {Object} Details for the nearest location
		 * @param infowindow {Object} Info window object
		 * @param storeStart {number} Starting point of current page when pagination is enabled
		 * @param page {number} Current page number when pagination is enabled
		 */
		openNearestLocation: function(nearestLoc, infowindow, storeStart, page) {
			this.writeDebug('openNearestLocation',arguments);

			if (this.settings.openNearest !== true || typeof nearestLoc === 'undefined' || (this.settings.fullMapStart === true && firstRun === true) || (this.settings.defaultLoc === true && firstRun === true)) {
				return;
			}

			var _this = this;

			// Callback
			if (_this.settings.callbackNearestLoc) {
				_this.settings.callbackNearestLoc.call(this, _this.map, nearestLoc, infowindow, storeStart, page);
			}

			var markerId = 0;
			var selectedMarker = markers[markerId];

			_this.createInfowindow(selectedMarker, 'left', infowindow, storeStart, page);

			// Scroll list to selected marker
			var $container = $('.' + _this.settings.locationList);
			var $selectedLocation = $('.' + _this.settings.locationList + ' li[data-markerid=' + markerId + ']');

			// Focus on the list
			$('.' + _this.settings.locationList + ' li').removeClass('list-focus');
			$selectedLocation.addClass('list-focus');

			$container.animate({
				scrollTop: $selectedLocation.offset().top - $container.offset().top + $container.scrollTop()
			});
		},

		/**
		 * Handle clicks from the location list
		 *
		 * @param map {Object} Google map
		 * @param infowindow {Object} Info window object
		 * @param storeStart {number} Starting point of current page when pagination is enabled
		 * @param page {number} Current page number when pagination is enabled
		 */
		listClick: function(map, infowindow, storeStart, page) {
			this.writeDebug('listClick',arguments);
			var _this = this;

			$(document).on('click.' + pluginName, '.' + _this.settings.locationList + ' li', function () {
				var markerId = $(this).data('markerid');
				var selectedMarker = markers[markerId];

				// List click callback
				if (_this.settings.callbackListClick) {
					_this.settings.callbackListClick.call(this, markerId, selectedMarker, locationset[markerId], map);
				}

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

				// Custom selected marker override
				if (_this.settings.selectedMarkerImg !== null) {
					_this.changeSelectedMarker(selectedMarker);
				}

				// Focus on the list
				$('.' + _this.settings.locationList + ' li').removeClass('list-focus');
				$('.' + _this.settings.locationList + ' li[data-markerid=' + markerId + ']').addClass('list-focus');
			});

			// Prevent bubbling from list content links
			$(document).on('click.'+pluginName, '.' + _this.settings.locationList + ' li a', function(e) {
				e.stopPropagation();
			});
		},

		/**
		 * Output total results count if HTML element with .bh-sl-total-results class exists
		 *
		 * @param locCount
		 */
		resultsTotalCount: function(locCount) {
			this.writeDebug('resultsTotalCount',arguments);

			var $resultsContainer = $('.bh-sl-total-results');

			if (typeof locCount === 'undefined' || locCount <= 0 || $resultsContainer.length === 0) {
				return;
			}

			$resultsContainer.text(locCount);
		},

		/**
		 * Inline directions setup
		 *
		 * @param map {Object} Google map
		 * @param origin {string} Origin address
		 */
		inlineDirections: function(map, origin) {
			this.writeDebug('inlineDirections',arguments);

			if (this.settings.inlineDirections !== true || typeof origin === 'undefined') {
				return;
			}

			var _this = this;

			// Open directions
			$(document).on('click.'+pluginName, '.' + _this.settings.locationList + ' li .loc-directions a', function (e) {
				e.preventDefault();
				var locID = $(this).closest('li').attr('data-markerid');
				_this.directionsRequest(origin, parseInt(locID), map);

				// Close directions
				$(document).on('click.'+pluginName, '.' + _this.settings.locationList + ' .bh-sl-close-icon', function () {
					_this.closeDirections();
				});
			});
		},

		/**
		 * Visible markers list setup
		 *
		 * @param map {Object} Google map
		 * @param markers {Object} Map markers
		 */
		visibleMarkersList: function(map, markers) {
			this.writeDebug('visibleMarkersList',arguments);

			if (this.settings.visibleMarkersList !== true) {
				return;
			}

			var _this = this;

			// Add event listener to filter the list when the map is fully loaded
			google.maps.event.addListenerOnce(map, 'idle', function(){
				_this.checkVisibleMarkers(markers, map);
			});

			// Add event listener for center change
			google.maps.event.addListener(map, 'center_changed', function() {
				_this.checkVisibleMarkers(markers, map);
			});

			// Add event listener for zoom change
			google.maps.event.addListener(map, 'zoom_changed', function() {
				_this.checkVisibleMarkers(markers, map);
			});
		},

		/**
		 * Restrict featured locations from displaying in results by a specific distance
		 *
		 * @returns {Array}
		 */
		featuredDistanceRestriction: function() {
			this.writeDebug('featuredDistanceRestriction',arguments);
			var _this = this;

			featuredset = $.grep(featuredset, function (val) {

				if (val.hasOwnProperty('distance')) {
					return parseFloat(val.distance) <= parseFloat(_this.settings.featuredDistance);
				}
			});

			return featuredset;
		},

		/**
		 * Restrict featured locations by distance.
		 *
		 * @returns {Array}
		 */
		featuredRestrictions: function(mappingObject) {
			this.writeDebug('featuredRestrictions',arguments);

			if (this.settings.featuredDistance === null) {
				return featuredset;
			}

			// Featured locations radius restriction.
			if (this.settings.featuredDistance !== null) {
					featuredset = this.featuredDistanceRestriction(mappingObject);
			}

			return featuredset;
		},

		/**
		 * The primary mapping function that runs everything
		 *
		 * @param mappingObject {Object} all the potential mapping properties - latitude, longitude, origin, name, max
		 *     distance, page
		 */
		mapping: function (mappingObject) {
			this.writeDebug('mapping',arguments);
			var _this = this;
			var orig_lat, orig_lng, geocodeData, origin, originPoint, page;
			if (!this.isEmptyObject(mappingObject)) {
				orig_lat = mappingObject.lat;
				orig_lng = mappingObject.lng;
				geocodeData = mappingObject.geocodeResult;
				origin = mappingObject.origin;
				page = mappingObject.page;
			}

			// Set the initial page to zero if not set
			if ( _this.settings.pagination === true ) {
				if (typeof page === 'undefined' || originalOrigin !== addressInput ) {
					page = 0;
				}
			}

			// Data request
			if (typeof origin === 'undefined' && this.settings.nameSearch === true) {
				dataRequest = _this._getData();
			}
			else {
				// Setup the origin point
				originPoint = new google.maps.LatLng(orig_lat, orig_lng);

				// If the origin hasn't changed use the existing data so we aren't making unneeded AJAX requests
				if ((typeof originalOrigin !== 'undefined') && (origin === originalOrigin) && (typeof originalData !== 'undefined')) {
					origin = originalOrigin;
					dataRequest = originalData;
				}
				else {
					// Do the data request - doing this in mapping so the lat/lng and address can be passed over and used if needed
					dataRequest = _this._getData(olat, olng, origin, geocodeData, mappingObject);
				}
			}

			// Check filters here to handle selected filtering after page reload
			if (_this.settings.taxonomyFilters !== null && _this.hasEmptyObjectVals(filters)) {
				_this.checkFilters();
			}
			/**
			 * Process the location data
			 */
			// Raw data
			if ( _this.settings.dataRaw !== null ) {
				_this.processData(mappingObject, originPoint, dataRequest, page);
			}
			// Remote data
			else {
				dataRequest.done(function (data) {
					_this.processData(mappingObject, originPoint, data, page);
				});
			}
		},

		/**
		 * Processes the location data
		 *
		 * @param mappingObject {Object} all the potential mapping properties - latitude, longitude, origin, name, max
		 *     distance, page
		 * @param originPoint {Object} LatLng of origin point
		 * @param data {Object} location data
		 * @param page {number} current page number
		 */
		processData: function (mappingObject, originPoint, data, page) {
			this.writeDebug('processData',arguments);
			var _this = this;
			var i = 0;
			var orig_lat, orig_lng, origin, name, maxDistance, marker, bounds, storeStart, storeNumToShow, myOptions, distError, openMap, infowindow, nearestLoc;
			var taxFilters = {};
			var $lengthSwap = $('#' + _this.settings.lengthSwapID);

			if (!this.isEmptyObject(mappingObject)) {
				orig_lat = mappingObject.lat;
				orig_lng = mappingObject.lng;
				origin = mappingObject.origin;
				name = mappingObject.name;
				maxDistance = mappingObject.distance;
			}

			var $mapDiv = $('#' + _this.settings.mapID);
			// Get the length unit
			var distUnit = (_this.settings.lengthUnit === 'km') ? _this.settings.kilometersLang : _this.settings.milesLang;

			// Save data and origin separately so we can potentially avoid multiple AJAX requests
			originalData = dataRequest;
			if ( typeof origin !== 'undefined' ) {
				originalOrigin = origin;
			}

			// Callback
			if (_this.settings.callbackSuccess) {
				_this.settings.callbackSuccess.call(this, mappingObject, originPoint, data, page);
			}

			openMap = $mapDiv.hasClass('bh-sl-map-open');

			// Set a variable for fullMapStart so we can detect the first run
			if (
				( _this.settings.fullMapStart === true && openMap === false ) ||
				( _this.settings.autoGeocode === true && openMap === false ) ||
				( _this.settings.defaultLoc === true && openMap === false ) ||
				reload === true
			) {
				firstRun = true;
			}
			else {
				_this.reset();
			}

			$mapDiv.addClass('bh-sl-map-open');

			// Process the location data depending on the data format type
			if (_this.settings.dataType === 'json' || _this.settings.dataType === 'jsonp') {

				// Process JSON
				for(var x = 0; i < data.length; x++){
					var obj = data[x];
					var locationData = {};

					// Parse each data variable
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							locationData[key] = obj[key];
						}
					}

					_this.locationsSetup(locationData, orig_lat, orig_lng, origin, maxDistance);

					i++;
				}
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

					_this.locationsSetup(locationData, orig_lat, orig_lng, origin, maxDistance);

					i++;
				});
			}
			else {
				// Process XML
				$(data).find(_this.settings.xmlElement).each(function () {
					var locationData = {};

					for (var key in this.attributes) {
						if (this.attributes.hasOwnProperty(key)) {
							locationData[this.attributes[key].name] = this.attributes[key].value;
						}
					}

					_this.locationsSetup(locationData, orig_lat, orig_lng, origin, maxDistance);

					i++;
				});
			}

			// Name search - using taxonomy filter to handle
			if (_this.settings.nameSearch === true) {
				if (typeof searchInput !== 'undefined' && '' !== searchInput) {
					filters[_this.settings.nameAttribute] = [searchInput];
				}
			}

			// Taxonomy filtering setup
			if (_this.settings.taxonomyFilters !== null || _this.settings.nameSearch === true) {

				for(var k in filters) {
					if (filters.hasOwnProperty(k) && filters[k].length > 0) {
						// Let's use regex
						for (var z = 0; z < filters[k].length; z++) {
							// Creating a new object so we don't mess up the original filters
							if (!taxFilters[k]) {
								taxFilters[k] = [];
							}

							// Swap pattern matching depending on name search vs. taxonomy filtering.
							if ( k === _this.settings.nameAttribute ) {
								taxFilters[k][z] = '(?:^|\\s)' + filters[k][z].replace(/([.*+?^=!:${}()|\[\]\/\\]|&\s+)/g, '');
							} else {
								taxFilters[k][z] = '(?=.*' + filters[k][z].replace(/([.*+?^=!:${}()|\[\]\/\\]|&\s+)/g, '') + '(?!\\s))';
							}
						}
					}
				}
				// Filter the data
				if (!_this.isEmptyObject(taxFilters)) {
					locationset = $.grep(locationset, function (val) {
						return _this.filterData(val, taxFilters);
					});
				}
			}

			// Sorting
			if (_this.settings.sortBy !== null && typeof _this.settings.sortBy === 'object') {
				_this.sortCustom(locationset);
			} else {
				// Sort the multi-dimensional array by distance
				if (typeof origin !== 'undefined') {
					_this.sortNumerically(locationset);
				}

				// Check the closest marker
				if (_this.isEmptyObject(taxFilters)) {
					if (_this.settings.maxDistance === true && maxDistance) {
						if (typeof locationset[0] === 'undefined' || locationset[0].distance > maxDistance) {
							_this.notify(_this.settings.distanceErrorAlert + maxDistance + ' ' + distUnit);
						}
					}
					else {
						if (typeof locationset[0] !== 'undefined') {
							if (_this.settings.distanceAlert !== -1 && locationset[0].distance > _this.settings.distanceAlert) {
								_this.notify(_this.settings.distanceErrorAlert + _this.settings.distanceAlert + ' ' + distUnit);
								distError = true;
							}
						}
						else {
							throw new Error('No locations found. Please check the dataLocation setting and path.');
						}
					}
				}

				// Save the closest location to a variable for openNearest setting.
				if (typeof locationset[0] !== 'undefined') {
					nearestLoc = locationset[0];
				}
			}

			// Featured locations filtering
			if (_this.settings.featuredLocations === true) {

				// Create array for featured locations
				featuredset = $.grep(locationset, function (val) {
						if (val.hasOwnProperty('featured')) {
								return val.featured === 'true';
						}
				});

				// Featured location restrictions.
				featuredset = _this.featuredRestrictions(mappingObject);

				// Create array for normal locations
				normalset = $.grep(locationset, function (val) {
					if (val.hasOwnProperty('featured')) {
						return val.featured !== 'true';
					}
				});

				// Combine the arrays
				locationset = [];
				locationset = featuredset.concat(normalset);
			}

			// Slide in the map container
			if (_this.settings.slideMap === true) {
				$this.slideDown();
			}

			// Output page numbers if pagination setting is true
			if (_this.settings.pagination === true) {
				_this.paginationSetup(page);
			}

			// Alternative method to display no results if locations are too far away instead of all locations.
			if (_this.settings.altDistanceNoResult === true && nearestLoc.distance > _this.settings.distanceAlert) {
				_this.emptyResult();
				return;
			}

			// Handle no results
			if (_this.isEmptyObject(locationset) || locationset[0].result === 'none') {
				_this.emptyResult();
				return;
			}

			// Set up the modal window
			_this.modalWindow();

			// Avoid error if number of locations is less than the default of 26
			if (_this.settings.storeLimit === -1 || locationset.length < _this.settings.storeLimit || (this.settings.fullMapStart === true && firstRun === true && (!isNaN(this.settings.fullMapStartListLimit) || this.settings.fullMapStartListLimit > 26 || this.settings.fullMapStartListLimit === -1))) {
				storeNum = locationset.length;
			}
			else {
				storeNum = _this.settings.storeLimit;
			}

			// If pagination is on, change the store limit to the setting and slice the locationset array
			if (_this.settings.pagination === true) {
				storeNumToShow = _this.settings.locationsPerPage;
				storeStart = page * _this.settings.locationsPerPage;

				if ( (storeStart + storeNumToShow) > locationset.length ) {
					storeNumToShow = _this.settings.locationsPerPage - ((storeStart + storeNumToShow) - locationset.length);
				}

				locationset = locationset.slice(storeStart, storeStart + storeNumToShow);
				storeNum = locationset.length;
			}
			else {
				storeNumToShow = storeNum;
				storeStart = 0;
			}

			// Output location results count
			_this.resultsTotalCount(locationset.length);

			// Google maps settings
			if (
				(_this.settings.fullMapStart === true && firstRun === true && _this.settings.querystringParams !== true) ||
				(_this.settings.mapSettings.zoom === 0) ||
				(typeof origin === 'undefined') ||
				(distError === true) ||
				(_this.settings.maxDistance === true && firstRun === false)
			) {
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

			// Create the map
			_this.map = new google.maps.Map(document.getElementById(_this.settings.mapID), myOptions);

			// Re-center the map when the browser is re-sized
			google.maps.event.addDomListener(window, 'resize', function() {
				var center = _this.map.getCenter();
				google.maps.event.trigger(_this.map, 'resize');
				_this.map.setCenter(center);
			});

			// Add map drag listener if setting is enabled and re-search on drag end
			if (_this.settings.dragSearch === true ) {
				_this.map.addListener('dragend', function() {
					_this.dragSearch(_this.map);
				});
			}

			// Load the map
			$this.data(_this.settings.mapID.replace('#', ''), _this.map);

			// Map set callback.
			if (_this.settings.callbackMapSet) {
				_this.settings.callbackMapSet.call(this, _this.map, originPoint, originalZoom, myOptions);
			}

			// Initialize the infowondow
			if ( typeof InfoBubble !== 'undefined' && _this.settings.infoBubble !== null ) {
				var infoBubbleSettings = _this.settings.infoBubble;
				infoBubbleSettings.map = _this.map;

				infowindow = new InfoBubble(infoBubbleSettings);
			} else {
				infowindow = new google.maps.InfoWindow();
			}


			// Add origin marker if the setting is set
			_this.originMarker(_this.map, origin, originPoint);

			// Handle pagination
			$(document).on('click.'+pluginName, '.bh-sl-pagination li', function (e) {
				e.preventDefault();
				// Run paginationChange
				_this.paginationChange($(this).attr('data-page'));
			});

			// Inline directions
			_this.inlineDirections(_this.map, origin);

			// Add markers and infowindows loop
			for (var y = 0; y <= storeNumToShow - 1; y++) {
				var letter = '';

				if (page > 0) {
					letter = String.fromCharCode('A'.charCodeAt(0) + (storeStart + y));
				}
				else {
					letter = String.fromCharCode('A'.charCodeAt(0) + y);
				}

				var point = new google.maps.LatLng(locationset[y].lat, locationset[y].lng);
				marker = _this.createMarker(point, locationset[y].name, locationset[y].address, letter, _this.map, locationset[y].category);
				marker.set('id', y);
				markers[y] = marker;
				if (
					(_this.settings.fullMapStart === true && firstRun === true && _this.settings.querystringParams !== true) ||
					(_this.settings.mapSettings.zoom === 0) ||
					(typeof origin === 'undefined') ||
					(distError === true) ||
					(_this.settings.maxDistance === true && firstRun === false)
				) {
					bounds.extend(point);
				}
				// Pass variables to the pop-up infowindows
				_this.createInfowindow(marker, null, infowindow, storeStart, page);
			}

			// Center and zoom if no origin or zoom was provided, or distance of first marker is greater than distanceAlert
			if (
				(_this.settings.fullMapStart === true && firstRun === true && _this.settings.querystringParams !== true) ||
				(_this.settings.mapSettings.zoom === 0) ||
				(typeof origin === 'undefined') ||
				(distError === true) ||
				(_this.settings.maxDistance === true && firstRun === false)
			) {
				_this.map.fitBounds(bounds);

				// Prevent zooming in too far after fitBounds
				var zoomListener = google.maps.event.addListener(_this.map, 'idle', function() {
					if (_this.map.getZoom() > 16) {
						_this.map.setZoom(16);
					}
					google.maps.event.removeListener(zoomListener);
				});
			}

			// Create the links that focus on the related marker
			var locList =  $('.' + _this.settings.locationList + ' ul');
			locList.empty();

			// Set up the location list markup
			if (
				firstRun &&
				_this.settings.fullMapStartListLimit !== false &&
				!isNaN(_this.settings.fullMapStartListLimit) &&
				_this.settings.fullMapStartListLimit !== -1 &&
				markers.length > _this.settings.fullMapStartListLimit
			) {
				for (var m = 0; m < _this.settings.fullMapStartListLimit; m++) {
					var currentMarker = markers[m];
					_this.listSetup(currentMarker, storeStart, page);
				}
			} else {
				$(markers).each(function (x) {
					var currentMarker = markers[x];
					_this.listSetup(currentMarker, storeStart, page);
				});
			}

			// Length unit swap setup
			if ($lengthSwap.length) {
				_this.lengthUnitSwap($lengthSwap);

				$lengthSwap.on('change.'+pluginName, function (e) {
					e.stopPropagation();
					_this.lengthUnitSwap($lengthSwap);
				});
			}

			// Open nearest location.
			_this.openNearestLocation(nearestLoc, infowindow, storeStart, page);

			// MarkerClusterer setup
			if ( typeof MarkerClusterer !== 'undefined' && _this.settings.markerCluster !== null ) {
				var markerCluster = new MarkerClusterer(_this.map, markers, _this.settings.markerCluster);
			}

			// Handle clicks from the list
			_this.listClick(_this.map, infowindow, storeStart, page);

			// Add the list li background colors - this wil be dropped in a future version in favor of CSS
			$('.' + _this.settings.locationList + ' ul > li:even').css('background', _this.settings.listColor1);
			$('.' + _this.settings.locationList + ' ul > li:odd').css('background', _this.settings.listColor2);

			// Visible markers list
			_this.visibleMarkersList(_this.map, markers);

			// Modal ready callback
			if (_this.settings.modal === true && _this.settings.callbackModalReady) {
				_this.settings.callbackModalReady.call(this, mappingObject);
			}

			// Filters callback
			if (_this.settings.callbackFilters) {
				_this.settings.callbackFilters.call(this, filters, mappingObject);
			}
		},

		/**
		 * console.log helper function
		 *
		 * http://www.briangrinstead.com/blog/console-log-helper-function
		 */
		writeDebug: function () {
			if (window.console && this.settings.debug) {
				// Only run on the first time through - reset this function to the appropriate console.log helper
				if (Function.prototype.bind) {
					this.writeDebug = Function.prototype.bind.call(console.log, console, 'StoreLocator :');
				} else {
					this.writeDebug = function () {
						arguments[0] = 'StoreLocator : ' + arguments[0];
						Function.prototype.apply.call(console.log, console, arguments);
					};
				}
				this.writeDebug.apply(this, arguments);
			}
		}

	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations and allowing any
	// public function (ie. a function whose name doesn't start
	// with an underscore) to be called via the jQuery plugin,
	// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
	$.fn[ pluginName ] = function (options) {
		var args = arguments;
		// Is the first parameter an object (options), or was omitted, instantiate a new instance of the plugin
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				// Only allow the plugin to be instantiated once, so we check that the element has no plugin instantiation yet
				if (!$.data(this, 'plugin_' + pluginName)) {
					// If it has no instance, create a new one, pass options to our plugin constructor, and store the plugin instance in the elements jQuery data object.
					$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
				}
			});
			// Treat this as a call to a public method
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			// Cache the method call to make it possible to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);

				// Tests that there's already a plugin-instance and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance, and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}

				// Allow instances to be destroyed via the 'destroy' method
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});

			// If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};


})(jQuery, window, document);
