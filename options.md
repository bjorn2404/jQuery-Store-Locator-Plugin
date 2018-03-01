## Standard settings

| Property | Default | Description |
|---|---|---|
| altDistanceNoResult | false | Display no results message vs. all locations when closest location is further than distanceAlert setting |
| autoComplete | false | Set to true to enable Google Places autocomplete. Note the slight markup differences in the example file. |
| autoCompleteDisableListener | false | Disable the listener that immediately triggers a search when an auto complete location option is selected. |
| autoCompleteOptions | {} | Google Places autocomplete [options object](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add_autocomplete). |
| autoGeocode | false | Set to true if you want to use the HTML5 geolocation API (good for mobile) to geocode the user's location. **SSL is required**. |
| bounceMarker | true | Bounces the maker when a list element is clicked. |
| catMarkers | null | Multiple replacement marker images based on categories object. Value should be array with image path followed by dimensions - ex value: catMarkers : {'Restaurant' : ['img/red-marker.svg', 32, 32]}
| dataLocation | 'data/locations.json' | The path to the location data. |
| dataRaw | null | Accepts raw KML, XML, or JSON instead of using a remote file. |
| dataType | 'json' | The format of the data source. Accepted values include kml, xml, json, and jsonp. |
| debug | false | Set to true to enable console.log helper function that can be used for debugging. |
| defaultLat | null | If using defaultLoc, set this to the default location latitude. |
| defaultLng | null | If using defaultLoc, set this to the default location longitude. |
| defaultLoc | false | If true, the map will load with a default location immediately. Set slideMap to false if you want to use this. |
| disableAlphaMarkers | false | Disable displaying markers and location list indicators with alpha characters. |
| distanceAlert | 60 | Displays alert if there are no locations with 60 m/km of the user's location. Set to -1 to disable. |
| dragSearch | false | Set to true to perform a new search after the map is dragged. |
| exclusiveFiltering | false | Set to true to enable exclusive taxonomy filtering rather than the default inclusive. |
| exclusiveTax | null | Set to comma separated array of taxonomies that should filter exclusively vs. inclusively.  |
| featuredLocations | false | Set to true to enable featuring locations at the top of the location list (no matter the distance). Add featured=”true” to featured locations in your XML or JSON locations data. |
| fullMapStart | false | Set to true if you want to immediately show a map of all locations. The map will center and zoom automatically. |
| fullMapStartBlank | false | Set to a zoom integer if you want to immediately show a blank map without any locations. |
| fullMapStartListLimit | false | Set to a number to limit the number of items displayed in the location list with full map start. |
| infoBubble | null | InfoBubble settings object. [See example for available parameters](https://googlemaps.github.io/js-info-bubble/examples/example.html). Map and content parameters are set by default. |
| inlineDirections | false | Set to true to enable displaying directions within the app instead of an off-site link. |
| lengthUnit | 'm' | The unit of length. Default is m for miles, change to km for kilometers. |
| listColor1 | '#ffffff' | Background color of the odd list elements. |
| listColor2 | '#eeeeee' | Background color of the even list elements. |
| loading | false | Set to true to display a loading animated gif next to the submit button. |
| locationsPerPage | 10 | If using pagination, the number of locations to display per page. |
| mapSettings | { zoom : 12, mapTypeId: google.maps.MapTypeId.ROADMAP } | Google maps settings object. Add all settings including zoom and map type if overriding. Set zoom to 0 to automatically center and zoom to show all display markers on the map |
| markerCluster | null | Marker Clusterer settings object. [See docs](https://googlemaps.github.io/js-marker-clusterer/docs/reference.html). |
| markerImg | null | Replacement marker image used for all locations |
| markerDim | null | Replacement marker dimensions object - ex value: { height: 20, width: 20 } |
| maxDistance | false | Set to true if you want to give users an option to limit the distance from their location to the markers. |
| modal | false | Shows the map container within a modal window. Set slideMap to false and this option to true to use. |
| nameAttribute | 'name' | If using nameSearch, the data attribute used for the location name in the data file. |
| nameSearch | false | Set to true to allow searching for locations by name using separate searchID field. |
| noForm | false | Set to true if you aren't able to use form tags (ASP.net WebForms). |
| openNearest | false | Set to true to highlight the nearest location automatically after searching. |
| originMarker | false | Display a marker at the origin. |
| originMarkerDim | null | Replacement origin marker dimensions object - ex value: { height: 20, width: 20 } |
| originMarkerImg | null | Replacement origin marker image. |
| pagination | false | Set to true to enable displaying location results in multiple "pages." |
| querystringParams | false | Set to true to enable query string support for passing input variables from page to page. |
| selectedMarkerImg | null | Selected marker image. |
| selectedMarkerImgDim | null | Selected marker image dimensions object - ex value: { height: 20, width: 20 } |
| sessionStorage | false | Set to true to enable Window.sessionStorage for user's location when autoGeocode is enabled. |
| slideMap | true | First hides the map container and then uses jQuery’s slideDown method to reveal the map. |
| storeLimit | 26 | The number of closest locations displayed at one time. Set to -1 for unlimited. |
| taxonomyFilters | null | Filtering object that can be used to set up live filtering (see categories example). |
| visibleMarkersList | false | Set to true to have the location list only show data from markers that are visible on the map. |
| xmlElement | 'marker' | XML element used for locations (tag). |

## HTML elements
| Property | Default | Description |
|---|---|---|
| addressID | 'bh-sl-address' | ID of the address input form field. |
| closeIcon| 'bh-sl-close-icon' | Class of element that displays the close icon to close the modal window. |
| formContainer | 'bh-sl-form-container' | Class of the container around the form. |
| formID | 'bh-sl-user-location' | ID of the input form. |
| geocodeID | null | Set to the ID of an element to connect the HTML5 geolocation API to a button instead of firing automatically. |
| loadingContainer | 'bh-sl-loading' | Class of element container that displays the loading animated gif. |
| locationList | 'bh-sl-loc-list' | Class of the container around the location list. |
| mapID | 'bh-sl-map' | ID of the div where the actual Google Map is displayed. |
| maxDistanceID | 'bh-sl-maxdistance' | ID of the select element for the maximum distance options. |
| modalContent | 'bh-sl-modal-content' | Class of element container around the content of the modal window. |
| modalWindow | 'bh-sl-modal-window' | Class of element of the actual modal window |
| overlay | 'bh-sl-overlay' | Class of element that fills 100% of the window and fills with a transparent background image. |
| regionID | 'bh-sl-region' | ID of the region select form field for country region biasing. |
| searchID | 'bh-sl-search' | ID of the search input form field for location name searching. |
| taxonomyFiltersContainer | 'bh-sl-filters-container' | Class of the container around the filters. |

## Templates
| Property | Default | Description |
|---|---|---|
| infowindowTemplatePath | 'assets/js/plugins/storeLocator/templates/infowindow-description.html' | Path to the default infowindow template. |
| listTemplatePath | 'assets/js/plugins/storeLocator/templates/location-list-description.html' | Path to the default list template. |
| KMLinfowindowTemplatePath | 'assets/js/plugins/storeLocator/templates/kml-infowindow-description.html' | Path to the KML infowindow template – used if dataType is set to kml. |
| KMLlistTemplatePath | 'assets/js/plugins/storeLocator/templates/kml-location-list-description.html' | Path to the KML list template – used if dataType is set to kml. |
| listTemplateID | null | ID of list template if using inline Handlebar templates instead of separate files. |
| infowindowTemplateID | null | ID of infowindow template if using inline Handlebar templates instead of separate files. |

## Callbacks

| Property | Default | Description |
|---|---|---|
| [callbackAutoGeoSuccess](callbacks/callback-autogeosuccess.md) | null | Geolocation API success callback |
| [callbackBeforeSend](callbacks/callback-beforesend.md) | null | | Before location data request callback |
| [callbackCloseDirections](callbacks/callback-closedirections.md) | null | | Close directions callback |
| [callbackCreateMarker](callbacks/callback-createmarker.md) | null | | Create marker override callback |
| [callbackDirectionsRequest](callbacks/callback-directionsrequest.md) | null | | Directions request callback |
| [callbackFilters](callbacks/callback-filters.md) | null | | Filters callback |
| [callbackFormVals](callbacks/callback-formvals.md) | null | | Form values callback |
| [callbackGeocodeRestrictions](callbacks/callback-geocode-restrictions.md) | null | | Geocoding component restrictions callback |
| [callbackJsonp](callbacks/callback-jsonp.md) | null | | JSONP callback |
| [callbackListClick](callbacks/callback-listclick.md) | null | | Location list click callback |
| [callbackMapSet](callbacks/callback-mapset.md) | null | | Map set callback |
| [callbackMarkerClick](callbacks/callback-markerclick.md) | null | | Marker click callback |
| [callbackModalClose](callbacks/callback-modalclose.md) | null | | Modal close callback |
| [callbackModalOpen](callbacks/callback-modalopen.md) | null | | Modal open callback |
| [callbackModalReady](callbacks/callback-modalready.md) | null | | Modal ready callback |
| [callbackNearestLoc](callbacks/callback-nearestloc.md) | null | | Nearest location callback |
| [callbackNoResults](callbacks/callback-noresults.md) | null | | No results callback |
| [callbackNotify](callbacks/callback-notification.md) | null | | Notification callback |
| [callbackPageChange](callbacks/callback-pagechange.md) | null | | Page change callback |
| [callbackRegion](callbacks/callback-region.md) | null | | Region callback |
| [callbackSuccess](callbacks/callback-success.md) | null | | Success callback |

## Language options
| Property | Default | Description |
|---|---|---|
| addressErrorAlert | 'Unable to find address' | Language setting |
| autoGeocodeErrorAlert | 'Automatic location detection failed. Please fill in your address or zip code.' | Language setting |
| distanceErrorAlert | 'Unfortunately, our closest location is more than ' | Language setting |
| kilometerLang | 'kilometer' | Language setting |
| kilometersLang | 'kilometers' | Language setting |
| mileLang | 'mile' | Language setting |
| milesLang | 'miles' | Language setting |
| noResultsTitle | 'No results' | Language setting |
| noResultsDesc | 'No locations were found with the given criteria. Please modify your selections or input.' | Language setting |
| nextPage | 'Next &raquo;' | Language setting |
| prevPage | '&laquo; Prev' | Language setting |
