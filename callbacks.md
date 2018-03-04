### jQuery Google Maps Store Locator callbacks

Several callbacks are available for use with the jQuery Store Locator plugin. The purpose of the callbacks is to allow 
developers to add custom functionality with JavaScript and/or jQuery upon certain events that happen when using the 
plugin. The functions listed below are executed at the time of these events.

When calling the plugin, a callback can be set to a function name or a function can be set up within the settings:

```javascript
$('#bh-sl-map-container').storeLocator({
	callbackSuccess: function(){
		// Whatever you want here
	}
});
```

Separate function example:

```javascript
function doSomethingOnSuccess() {
	// Whatever you want here
}

$('#bh-sl-map-container').storeLocator({
	callbackSuccess: doSomethingOnSuccess()
});
```


| Function | Default | Description |
|---|---|---|
| [callbackAutoGeoSuccess](callbacks/callback-autogeosuccess.md) | null | Geolocation API success callback |
| [callbackBeforeSend](callbacks/callback-beforesend.md) | null | Before location data request callback |
| [callbackCloseDirections](callbacks/callback-closedirections.md) | null | Close directions callback |
| [callbackCreateMarker](callbacks/callback-createmarker.md) | null | Create marker override callback |
| [callbackDirectionsRequest](callbacks/callback-directionsrequest.md) | null | Directions request callback |
| [callbackFilters](callbacks/callback-filters.md) | null | Filters callback |
| [callbackFormVals](callbacks/callback-formvals.md) | null | Form values callback |
| [callbackGeocodeRestrictions](callbacks/callback-geocode-restrictions.md) | null | Geocoding component restrictions callback |
| [callbackJsonp](callbacks/callback-jsonp.md) | null | JSONP callback |
| [callbackListClick](callbacks/callback-listclick.md) | null | Location list click callback |
| [callbackMapSet](callbacks/callback-mapset.md) | null | Map set callback |
| [callbackMarkerClick](callbacks/callback-markerclick.md) | null | Marker click callback |
| [callbackModalClose](callbacks/callback-modalclose.md) | null | Modal close callback |
| [callbackModalOpen](callbacks/callback-modalopen.md) | null | Modal open callback |
| [callbackModalReady](callbacks/callback-modalready.md) | null | Modal ready callback |
| [callbackNearestLoc](callbacks/callback-nearestloc.md) | null | Nearest location callback |
| [callbackNoResults](callbacks/callback-noresults.md) | null | No results callback |
| [callbackNotify](callbacks/callback-notification.md) | null | Notification callback |
| [callbackPageChange](callbacks/callback-pagechange.md) | null | Page change callback |
| [callbackRegion](callbacks/callback-region.md) | null | Region callback |
| [callbackSorting](callbacks/callback-sorting.md) | null | Sorting callback |
| [callbackSuccess](callbacks/callback-success.md) | null | Success callback |
