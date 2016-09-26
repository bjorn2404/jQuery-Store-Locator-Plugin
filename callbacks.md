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


| Function | Description |
|---|---|
| [callbackNotify](callbacks/callback-notification.md) | Notification callback |
| [callbackBeforeSend](callbacks/callback-beforesend.md) | Before location data request callback |
| [callbackDirectionsRequest](callbacks/callback-directionsrequest.md) | Directions request callback |
| [callbackCloseDirections](callbacks/callback-closedirections.md) | Close directions callback |
| [callbackNoResults](callbacks/callback-noresults.md) | No results callback |
| [callbackJsonp](callbacks/callback-jsonp.md) | JSONP callback |
| [callbackCreateMarker](callbacks/callback-createmarker.md) | Create marker override callback |
| [callbackSuccess](callbacks/callback-success.md) | Success callback |
| [callbackMapSet](callbacks/callback-mapset.md) | Map set callback |
| [callbackModalOpen](callbacks/callback-modalopen.md) | Modal open callback |
| [callbackModalReady](callbacks/callback-modalready.md) | Modal ready callback |
| [callbackModalClose](callbacks/callback-modalclose.md) | Modal close callback |
| [callbackMarkerClick](callbacks/callback-markerclick.md) | Marker click callback |
| [callbackListClick](callbacks/callback-listclick.md) | Location list click callback |
| [callbackPageChange](callbacks/callback-pagechange.md) | Page change callback |
| [callbackFilters](callbacks/callback-filters.md) | Filters callback |