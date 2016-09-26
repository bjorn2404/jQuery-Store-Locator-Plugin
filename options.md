| Property | Default | Description |
|---|---|---|
| mapID | 'bh-sl-map' | ID of the div where the actual Google Map is displayed. |
| locationList | 'bh-sl-loc-list' | Class of the container around the location list. |
| formContainer | 'bh-sl-form-container' | Class of the container around the form. |
| formID | 'bh-sl-user-location' | ID of the input form. |
| addressID | 'bh-sl-address' | ID of the address input form field. |
| regionID | 'bh-sl-region' | ID of the region select form field for country region biasing. |
| mapSettings | { zoom : 12, mapTypeId: google.maps.MapTypeId.ROADMAP } | Google maps settings object. Add all settings including zoom and map type if overriding. Set zoom to 0 to automatically center and zoom to show all display markers on the map |
| markerImg | null | Replacement marker image used for all locations |
| markerDim | null | Replacement marker dimensions object - ex value: { height: 20, width: 20 } |
| catMarkers | null | Multiple replacement marker images based on categories object. Value should be array with image path followed by dimensions - ex value: catMarkers : {'Restaurant' : ['img/red-marker.svg', 32, 32]}
| selectedMarkerImg | null | Selected marker image. |
| selectedMarkerImgDim | null | Selected marker image dimensions object - ex value: { height: 20, width: 20 } |
| disableAlphaMarkers | false | Disable displaying markers and location list indicators with alpha characters. |
| lengthUnit | 'm' | The unit of length. Default is m for miles, change to km for kilometers. |
| storeLimit | 26 | The number of closest locations displayed at one time. Set to -1 for unlimited. |
| distanceAlert | 60 | Displays alert if there are no locations with 60 m/km of the user's location. Set to -1 to disable. |
| dataType | 'xml' | The format of the data source. Accepted values include kml, xml, json, and jsonp. |
| dataLocation | 'data/locations.xml' | The path to the location data. |
| dataRaw | null | Accepts raw KML, XML, or JSON instead of using a remote file. |
| xmlElement | 'marker' | XML element used for locations (tag). |
| listColor1 | '#ffffff' | Background color of the odd list elements. |
| listColor2 | '#eeeeee' | Background color of the even list elements. |
| originMarker | false | Display a marker at the origin. |
| originMarkerImg | null | Replacement origin marker image. |
| originMarkerDim | null | Replacement origin marker dimensions object - ex value: { height: 20, width: 20 } |
| bounceMarker | true | Bounces the maker when a list element is clicked. |
| slideMap | true | First hides the map container and then uses jQuery’s slideDown method to reveal the map. |
| modal | false | Shows the map container within a modal window. Set slideMap to false and this option to true to use. |
| overlay | 'bh-sl-overlay' | Class of element that fills 100% of the window and fills with a transparent background image. |
| modalWindow | 'bh-sl-modal-window' | Class of element of the actual modal window |
| modalContent | 'bh-sl-modal-content' | Class of element container around the content of the modal window. |
| closeIcon| 'bh-sl-close-icon' | Class of element that displays the close icon to close the modal window. |
| defaultLoc | false | If true, the map will load with a default location immediately. Set slideMap to false if you want to use this. |
| defaultLat | null | If using defaultLoc, set this to the default location latitude. |
| defaultLng | null | If using defaultLoc, set this to the default location longitude. |
| autoComplete | false | Set to true to enable Google Places autocomplete. Note the slight markup differences in the example file. |
| autoCompleteOptions | {} | Google Places autocomplete [options object](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add_autocomplete). |
| autoGeocode | false | Set to true if you want to use the HTML5 geolocation API (good for mobile) to geocode the user's location. |
| geocodeID | null | Set to the ID of an element to connect the HTML5 geolocation API to a button instead of firing automatically. |
| maxDistance | false | Set to true if you want to give users an option to limit the distance from their location to the markers. |
| maxDistanceID | 'bh-sl-maxdistance' | ID of the select element for the maximum distance options. |
| fullMapStart | false | Set to true if you want to immediately show a map of all locations. The map will center and zoom automatically. |
| fullMapStartBlank | false | Set to a zoom integer if you want to immediately show a blank map without any locations. |
| fullMapStartListLimit | false | Set to a number to limit the number of items displayed in the location list with full map start. |
| noForm | false | Set to true if you aren't able to use form tags (ASP.net WebForms). |
| loading | false | Set to true to display a loading animated gif next to the submit button. |
| loadingContainer | 'bh-sl-loading' | Class of element container that displays the loading animated gif. |
| featuredLocations | false | Set to true to enable featuring locations at the top of the location list (no matter the distance). Add featured=”true” to featured locations in your XML or JSON locations data. |
| pagination | false | Set to true to enable displaying location results in multiple "pages." |
| locationsPerPage | 10 | If using pagination, the number of locations to display per page. |
| inlineDirections | false | Set to true to enable displaying directions within the app instead of an off-site link. |
| nameSearch | false | Set to true to allow searching for locations by name using separate searchID field. |
| searchID | 'bh-sl-search' | ID of the search input form field for location name searching. |
| nameAttribute | 'name' | If using nameSearch, the data attribute used for the location name in the data file. |
| visibleMarkersList | false | Set to true to have the location list only show data from markers that are visible on the map. |
| dragSearch | false | Set to true to perform a new search after the map is dragged. |
| infowindowTemplatePath | 'assets/js/plugins/storeLocator/templates/infowindow-description.html' | Path to the default infowindow template. |
| listTemplatePath | 'assets/js/plugins/storeLocator/templates/location-list-description.html' | Path to the default list template. |
| KMLinfowindowTemplatePath | 'assets/js/plugins/storeLocator/templates/kml-infowindow-description.html' | Path to the KML infowindow template – used if dataType is set to kml. |
| KMLlistTemplatePath | 'assets/js/plugins/storeLocator/templates/kml-location-list-description.html' | Path to the KML list template – used if dataType is set to kml. |
| listTemplateID | null | ID of list template if using inline Handlebar templates instead of separate files. |
| infowindowTemplateID | null | ID of infowindow template if using inline Handlebar templates instead of separate files. |
| taxonomyFilters | null | Filtering object that can be used to set up live filtering (see categories example). |
| taxonomyFiltersContainer | 'bh-sl-filters-container' | Class of the container around the filters. |
| exclusiveFiltering | false | Set to true to enable exclusive taxonomy filtering rather than the default inclusive. |
| querystringParams | false | Set to true to enable query string support for passing input variables from page to page. |
| debug | false | Set to true to enable console.log helper function that can be used for debugging. |
| sessionStorage | false | Set to true to enable Window.sessionStorage for user's location when autoGeocode is enabled. |
| markerCluster | null | Marker Clusterer settings object. [See docs](https://googlemaps.github.io/js-marker-clusterer/docs/reference.html). |
| infoBubble | null | InfoBubble settings object. [See example for available parameters](https://googlemaps.github.io/js-info-bubble/examples/example.html). Map and content parameters are set by default. |
| callbackNotify | null | Callback that can override the notify method. |
| callbackBeforeSend | null | Callback that fires before the AJAX request. |
| callbackSuccess | null | Callback that fires on successful AJAX request. |
| callbackModalOpen | null | Callback that fires when a modal opens. |
| callbackModalReady | null | Callback that fires when the content of the modal is generated. |
| callbackModalClose | null | Callback that fires when a modal closes. |
| callbackJsonp | null | Callback that can specify the callback function name of a JSONP request. |
| callbackCreateMarker | null | Callback that will override the markers. This must return the marker object. |
| callbackPageChange | null | Callback that fires when the page changes if pagination is enabled. |
| callbackDirectionsRequest | null | Callback that fires upon a directions request when using the inline directions option. |
| callbackCloseDirections | null | Callback that fires when the directions panel closes. |
| callbackNoResults | null | Callback that fires when no results are found. |
| callbackListClick | null | Callback that fires when a list element is clicked in the location list. |
| callbackMarkerClick | null | Callback that fires when a map marker is clicked. |
| callbackFilters | null | Callback that fires when a filter is changed. |
| callbackMapSet | null | Callback that fires after the map is set up. |
| addressErrorAlert | 'Unable to find address' | Language setting |
| autoGeocodeErrorAlert | 'Automatic location detection failed. Please fill in your address or zip code.' | Language setting |
| distanceErrorAlert | 'Unfortunately, our closest location is more than ' | Language setting |
| mileLang | 'mile' | Language setting |
| milesLang | 'miles' | Language setting |
| kilometerLang | 'kilometer' | Language setting |
| kilometersLang | 'kilometers' | Language setting |
| noResultsTitle | 'No results' | Language setting |
| noResultsDesc | 'No locations were found with the given criteria. Please modify your selections or input.' | Language setting |
| nextPage | 'Next &raquo;' | Language setting |
| prevPage | '&laquo; Prev' | Language setting |
