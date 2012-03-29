# [jQuery Store Locator Plugin](http://www.bjornblog.com/web/jquery-store-locator-plugin)

### [Please see my blog for more information and examples](http://www.bjornblog.com/web/jquery-store-locator-plugin).

This jQuery plugin takes advantage of Google Maps API version 3 to create an easy to implement store locator. No back-end programming is required or used, you just need to feed it an XML file with all the location data. How you create the XML file is up to you. I originally created this for a company that didn’t have many locations, so I just used a static XML file. I also decided to geocode all the locations beforehand, to make sure it quick and to avoid any potential geocoding errors. However, if you’re familiar with JavaScript you could easily make a modification to geocode everything on the fly. 

A note on the distance calculation: this plugin currently uses a distance function that was originally programmed by [Chris Pietschmann](http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx). Google Maps API version 3 does include a distance calculation service ([Google Distance Matrix API](http://code.google.com/apis/maps/documentation/distancematrix/)) but I decided not to use it because of the current request limits, which seem somewhat low. In addition, because the plugin currently calculates each location’s distance one by one, it appeared that I would have to re-structure some things to make all the distance calculations at once (or risk making many request for one location lookup). So, the distance calculation is “as the crow flies” instead of a road distance.

## Changelog

### Version 1.1.3

Serlialize was targeting any form on the page instead of the specific formID. Thanks to Scott for pointing it out.

### Version 1.1.2

Changed it so that the processing stops if the user input is blank.

### Version 1.1.1

Added a modal window option. Set slideMap to false and modalWindow to true to use it. Also started using the new [jQuery .on() event api](http://blog.jquery.com/2011/11/03/jquery-1-7-released/) - make sure you're using jQuery v1.7+ or this won't work.

### Version 1.0.1

Left a couple of console.logs in my code, which was causing IE to hang.

### Version 1.0

This is my first jQuery plugin and the first time I’ve published anything on Github. Let me know if I can improve something or if I’m making some kind of mistake. 