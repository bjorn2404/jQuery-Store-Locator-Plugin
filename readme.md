# [jQuery Store Locator Plugin](http://www.bjornblog.com/web/jquery-store-locator-plugin)

### [Please see my blog for more information and examples](http://www.bjornblog.com/web/jquery-store-locator-plugin).

This jQuery plugin takes advantage of Google Maps API version 3 of the to create an easy to implement store locator. No back-end programming is required or used, you just need to feed it an XML file with all the location data. How you create the XML file is up to you. I originally created this for a company that didn’t have many locations, so I just used a static XML file. I also decided to geocode all the locations beforehand, to make sure it quick and to avoid any potential geocoding errors. However, if you’re familiar with JavaScript you could easily make a modification to geocode everything on the fly. 

A note on the distance calculation: this plugin currently uses a distance function that was originally programmed by [Chris Pietschmann](http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx). Google Maps API version 3 does include a distance calculation service ([Google Distance Matrix API](http://code.google.com/apis/maps/documentation/distancematrix/)) but I decided not to use it because of the current request limits, which seem somewhat low. In addition, because the plugin currently calculates each location’s distance one by one, it appeared that I would have to re-structure some things to make all the distance calculations at once (or risk making many request for one location lookup). So, the distance calculation is “as the crow flies” instead of a road distance.

## Changelog

### Version 1.0

This is my first jQuery plugin and the first time I’ve published anything on Github. Let me know if I can improve something or if I’m making some kind of mistake. 