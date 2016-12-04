# callbackRegion

## Description

Allows region to be set before being sent to the Google Maps Geocoding API. This could allow for additional
processing of the user input or setting the region via other detection methods. Value should be set to a
[ccTLD](https://developers.google.com/maps/documentation/geocoding/#RegionCodes) two letter country code. Ex: US,UK,CA

## Parameters

| Name | Type | Description |
|---|---|---|
| addressInput | string | User address input |
| searchInput | string | User name search input when using nameSearch setting |
| distance | string | User distance selection when using maxDistance setting |