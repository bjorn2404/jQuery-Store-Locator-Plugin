# callbackCreateMarker

## Description

Allows map markers to be overridden with a custom marker. Please refer to the 
[Google MarkerOptions documentation](https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions) 
to review the available marker object properties. A marker object must be returned for this callback to function
correctly. A basic example of overriding the markers with a single image URL is below.

## Parameters

| Name | Type | Description |
|---|---|---|
| map | object | Google Map object |
| point | object | LatLng of current location |
| letter | string | Optional letter used for front-end identification and correlation between list and points |
| category | string | Location category/categories |

## Example

```javascript
$('#bh-sl-map-container').storeLocator({
  callbackCreateMarker: function(map, point, letter, category) {

    return new google.maps.Marker({
      position : point,
      map      : map,
      icon     : 'https://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png',
      draggable: false
    });

  }
});
```