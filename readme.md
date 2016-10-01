# [jQuery Google Maps Store Locator Plugin](http://www.bjornblog.com/web/jquery-store-locator-plugin)

### The files you're looking for are in the dist/ directory
### [Please see my blog for more information and examples](http://www.bjornblog.com/web/jquery-store-locator-plugin).

This jQuery plugin takes advantage of Google Maps API version 3 to create an easy to implement store locator. No 
back-end programming is required, you just need to feed it KML, XML, or JSON data with all the location information. 
How you create the data file is up to you. I originally created this for a company that didn’t have many locations, so I 
just used a static XML file. You will need to geocode your locations beforehand or use a geocoding API service if
you want to try to do it on the fly. The reason for this is that all free geocoding APIs have strict limits that would
easily be exceeded. In the end, you're much better off storing the coordinates versus having to look them up for each
location on each request.

A note on the distance calculation: this plugin currently uses a distance function that I found on the blog of 
[Chris Pietschmann](http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx). 
Google Maps API version 3 does include a distance calculation service 
([Google Distance Matrix API](http://code.google.com/apis/maps/documentation/distancematrix/)) but I decided not to use 
it because of the current request limits, which seem somewhat low. For v2 I also tried experimenting with the Directions API to request distances but also found the limits to be too restrictive. So, the distance calculation is “as the crow flies” instead of a 
road distance calculation. However, if you use the inline directions option that does provide the distance that's returned via the directions request.

Last, it’s very important to note that the plugin requires the Handlebars template engine. This separates the markup of the 
infowindows and location list elements so that they can easily be restructured. Handlebars pretty slick, will read 
Mustache templates, and the built-in helpers really come in handy. Depending on what your data source is, 2 of the 
4 total templates will be used (KML vs XML or JSON) and there are options to set the paths of each template if you don’t 
want them in the default location. If you’re developing something for mobile devices the templates can be pre-compiled 
for even faster loading.

### WordPress version

[Cardinal Store Locator plugin for WordPress](https://cardinalwp.com/) is now available, which uses this jQuery plugin 
as a base and all of the settings can be set via a settings page in the WP dashboard. It also integrates with core 
WordPress features such as custom post types for location data and custom taxonomies for location categorization and 
filtering.


## Changelog

### Version 2.7.1

* Hotfix to prevent potential error with updated filterData method if the category of a location is undefined.

### Version 2.7.0

* Added [callback documentation](callbacks.md).
* Added callbackCreateMarker for custom marker overrides.
* Added [InfoBubble](https://github.com/googlemaps/js-info-bubble) support and example file.
* Added location results total count if HTML element with "bh-sl-total-results" class exists.
* Added checks to replace non-ASCII characters when filtering.
* Added reset functionality that can be triggered via a button that has the CSS class "bh-sl-reset".
* Added query string parameter filter check so that results can be filtered with URL query strings.
* Fixed issue with maxDistance and querystringParams settings combination.
* Moved some functionality from processData into new separate methods.
* Removed non-standard $1 RegExp property in processData method.

### Version 2.6.2

* Added callbackMapSet callback that fires after the map has been set up.
* Fixed issue where locations without attributes set could get the attribute values from prior locations.
* Fixed issue where pagination total number of pages was based on the full location set total instead of the storeLimit setting.
* Removed form markup from initial query string example index file as it's not needed until the submission page.

### Version 2.6.1

* Added additional error handling when the plugin checks the closest location.
* Added listener for autoComplete change so that the search processes when a new place is selected.
* Fixed [issue with new boundary search](https://github.com/bjorn2404/jQuery-Store-Locator-Plugin/issues/127) AJAX params after a full address search was made.
* Merged in pull request from [noclat](https://github.com/noclat) that added autoCompleteOptions setting.

### Version 2.6.0

* Added bounds and formatted address info from geocoding API to AJAX data parameters.
* Added Marker Clusterer library support, setting and example file.
* Added disableAlphaMarkers setting to completely disable displaying markers and location list indicators with alpha characters.
* Fixed issue with combination of autoGeocode and originMarker settings.
* Merged in pull request from [drcomix](https://github.com/drcomix) that fixed zoom issue with dragSearch setting.
* Switched included remote scripts in example files to https.
* Updated jQuery references to the latest version.

### Version 2.5.3

* Removed check from createMarker method that removed spaces from categories - created issues with categories that have spaces.
* Re-worked handling of no results.
* Updated createMarker method to ensure custom category marker images are converted to integers if strings are passed for dimensions.
* Updated autoGeocode and default location functionality so that max distance is applied on initial load.

### Version 2.5.2

* Fixed pagination bubbling issue.
* Fixed pagination issues with autoGeocode and dragSearch combinations.

### Version 2.5.1

* Fixed issues with visibleMarkersList and location list background colors and selection.

### Version 2.5.0

* Added new dragSearch setting which performs a new search when the map is dragged when enabled.
* Added new geocodeID setting so that the HTML geocoding API can be triggered by a button instead of firing automatically.
* Fixed issues with no results where clicking the marker would display data from the previous result and clicking the location list item would throw an error.
* Merged in pull request from [hawkmeister](https://github.com/hawkmeister) with update to bower.json file with main property.
* Merged in pull request from [hyperTwitch](https://github.com/hyperTwitch) with fixes for using fullMapStartListLimit in combination with a different store limit.
* Updated jQuery references to the latest version.

### Version 2.4.2

* Fixed issue with new full map start location list limit where clicking on a marker that didn't have a list item
displayed caused an error.
* Fixed issue with settings combination of inline directions and default location.
* Reverted change to new list limit so that it's always applied with full map start enabled.

### Version 2.4.1

* Changed new full map start list limit so that it's only applied on the initial load.
* Fixed issue with new autocomplete setting where search was firing twice.

### Version 2.4.0

* Added new selected marker image options to highlight clicked marker.
* Added Google Places autocomplete option and example file.
* Added full map start location list limit setting.

### Version 2.3.3

* Removed code that temporarily hid the map and results, when there are no results, in favor of just displaying the no 
results message and empty map.

### Version 2.3.2

* Tweaked list label width styling.

### Version 2.3.1

* Added preventative styling to inline directions panel table.
* Switched to unitless line-heights.

### Version 2.3.0

* Added fullMapStartBlank option to show a blank map without any locations initially. Set this setting to an integer, 
which will be applied as the initial Google Maps zoom value and will then fall back to the mapSettings zoom level after
a search is performed.
* Added fullMapStartBlank example file.
* Fixed filters select field styling inconsistency.
* Moved pagination container within map container div in pagination example to avoid confusion when combined with modal option.
* Reworked styling so that all HTML example files are responsive by default.
* Updated map-container ID in all example files with bh-sl prefix.

### Version 2.2.2

* Added preventative styling to avoid table conflicts with directions panel.
* Fixed clearMarkers issue with inline directions enabled.

### Version 2.2.1

* Updated preventative styling to be more specific to the map container and added max-height img rule.

### Version 2.2.0

* Added check for Google Maps API.
* Added Grunt Handlebars task for compiling Handlebars templates from src directory - will add more compatibility in future release.
* Added preventative styling to avoid conflicts with CSS frameworks and resets.
* Default design refresh.
* Fixed bug with inline directions panel that occurred after multiple address submissions.
* Removed sensor parameter from Google Maps API URL as it's no longer needed.
* Switched the default plugin styling from LESS to SASS.
* Updated included Handlebars to v4.0.5.

### Version 2.1.0

Includes contributions from from [Giancarlo Gomez](https://github.com/GiancarloGomez).

* Added ability to pass in array object as dataRaw.
* Added writeDebug console.log helper function for debugging.
* Added sessionStorage option to store user's location when autoGeocode in enabled to prevent multiple lookups per session.
* Fixed bug with inline directions panel that occurred after multiple address submissions.
* Updated processForm method form field variables with empty string fallback values.

### Version 2.0.9

* Fixed issue when using catMarkers setting and not setting a location's category resulted in an error.

### Version 2.0.8

* Changed infowindow and location list templates so that the comma is added if the city is available.
* Fixed issue with inline directions where "null" was prepended to the destination address.
* Fixed close directions bug where close icon couldn't be clicked more than two times.
* Fixed bug where form wasn't overriding query string parameters.
* Updated processForm method to accept max distance query string parameter.
* Updated processForm method to use existing origin data if it's present and matches to avoid unnecessary geocode 
requests.
* Updated max distance check to less than or equal to the selected distance vs. just less than.
* Updated regionID description in options.md for clarity.
* Updated formEventHandler method to prevent ASP.net form submission on keydown instead of keyup.
* Updated mapSettings description in options.md to highlight that zoom can be set to 0 for automatic centering and zooming.

### Version 2.0.7

* Fixed bug where reverse geocoding wasn't passing the origin to the templates (autogeocode and default location),
causing incorrect direction links.
* Updated location list directions link to use https.

### Version 2.0.6

* Added the option to filter data exclusively rather than inclusively with the exclusiveFiltering setting.
* Added callbackFilters that fires when a filter is changed and returns the filter values if needed.
* Added dataRaw option to use raw KML, XML or JSON data instead of the AJAX call.
* Added basic raw data example rawdata-example.php file.
* Added visibleMarkersList option that updates the location list to only display data from the markers that are curently
displayed on the map.
* Changed the distance error functionality so that the map centers and zooms automatically and all locations are
displayed on the map.
* Fixed issue with fullMapStart and inlineDirections setting combination.
* Fixed issue with global olat and olng variables not being set with autoGeocode setting enabled.
* Fixed issue with maxDistance and autoGeocode setting combination.

### Version 2.0.5

* Fixed typo with originMarker setup.
* Made the originMarkerDim setting optional when setting a custom origin marker image - defaults to 32px by 32px.
* Removed geocodeErrorAlert language option and switched error alerts to custom exceptions so users aren't shown
multiple alerts.
* Fixed bug with inline directions where close icon wasn't being removed on page reload.
* Added callbackListClick that fires when a list element is clicked.
* Added callbackMarkerClick that fires when a map marker is clicked.

### Version 2.0.4

* Fixed bug with maxDistance and pagination setting combination. The last page of of the pagination results was set to
use the locationsPerPage setting instead of the remaining number, which could have resulted in the plugin trying to 
load undefined locations.
* Fixed bugs with googleGeocode and reverseGoogleGeocode methods in which references to "this" were undefined.

### Version 2.0.3

* Fixed bug with maxDistance setting - updated locationsSetup method so that the locationset array uses array.push
instead of incrementing via a passed in parameter, which was causing undefined array elements and causing errors.
* Removed testing line from maxdistance-example.html that was left in.

### Version 2.0.2

* Updated the Handlebars.compile calls when using the inline template options to include the ID hash so that it's
consistent with the other ID settings.
* Fixed incorrect callback call in the modalClose method - callbackModalOpen to callbackModalClose.
* Added callbackModalReady that fires when the the content of the modal is generated.
* Fixed markerImg setting - previously threw error if markerDim wasn't set.

### Version 2.0.1

* Quick fix to remove a dupicate copyright notice in dist/ file. Copyright was removed from src/jquery.storelocator.js 
file to prevent duplication with the Grunt Banner task.

### Version 2.0.0

Version 2 is a complete rewrite of the plugin based on the "basic" plugin pattern of the 
[jQuery Boilerplate](http://jqueryboilerplate.com/). The overall file structure has changed, several of the [plugin 
settings](options.md) have changed and all of the CSS is now prefixed to avoid potential collisions. In other words, 
you're not going to be able to simply replace the main plugin file to upgrade to the latest version. I've been working
on this update off and on for the past six months, so a lot has changed. I've also added many new features based on the most common requests I've received. The following list doesn't cover everything that's new but all of the important items to note:

* [Grunt](http://gruntjs.com/) is now utilized to minify and compile the plugin and CSS. You only need to worry about running this if you're doing extensive modifications or are interested in submitting a pull request.
* Plugin file structure and programming pattern have been reworked to follow the [basic jQuery Boilerplate pattern](https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js)
* Many of the methods are public and can be called as needed
* Google Maps settings are now exposed as a setting. Instead of trying to modify the plugin to make Google Maps settings changes simply use the mapSettings option to override.
* Added inline directions option
* Added multi-group live filtering via regex for quick category, etc. filtering.
* Added option to search locations by name
* Added option to set custom markers by category
* Added option for paginating results
* Added responsive Bootstrap example
* Added region biasing setting to handle region/country select field
* Added coordinates and address (user input) to primary AJAX GET request for better back-end integration
* Added option to check for query string parameters

### Version 1.4.9

More contributions from [Mathieu Boillat](https://github.com/ollea) and [Jimmy Rittenborg](https://github.com/JimmyRittenborg) in addition to a few style updates:

* Store the map object into the jQuery object in order to retrieve it by calling $object.data('map').
* Possibility to add custom variables in locations
* If 'distance' variable is set in location, do not calculate it
* Enabling the new Google Maps [https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh](visual refresh)
* Replaced submit image button image with button tag and CSS3
* Overrode new infowindow Roboto font for consistent style
* Removed icon shadows because they are no longer work in the upcoming version of Google Maps: see [https://developers.google.com/maps/documentation/javascript/basics#VisualRefresh](Changes in the visual refresh section)
* Changed "locname" to "name" for each location in the JSON file to match other location data types and to avoid renaming
* Simplified some parts of the code

### Version 1.4.8

This update is made up of contributions from [Mathieu Boillat](https://github.com/ollea) and [Jimmy Rittenborg](https://github.com/JimmyRittenborg):

* Added the possibility to set the 'storeLimit' option to -1, which means unlimited
* Added the possibility to set the 'distanceAlert' option to -1, which means disable distance alert
* Added little checks to only format 'web' variable when it is not null otherwise javascript would gives an error
* Possibility to add custom variables in locations
* If 'distance' variable is set in location, do not calculate it
* Simplified some parts of the code
* If noForm is true, only simulate the submit when the field is actually in focus

### Version 1.4.7

Added ability to feature locations so that they always show at the top of the location list. To use, set the featuredLocations option to true and add featured="true" to featured locations in your XML or JSON locations data.

### Version 1.4.6

Fixed a bug where infowindows wouldn't open if the map div was changed.

### Version 1.4.5

A minor update that includes the latest versions of jQuery and Handlebars, two new location variables and some clean-up. 

* Added email and country variables for locations
* Updated included Handlebars version to v1.0.0
* Updated jQuery call to v1.10.1
* Some bracket clean-up

### Version 1.4.4

This update includes a bug fix for form re-submissions that was most apparent with the maximum distance example. It also includes a new jsonpCallback setting that was submitted by quayzar.

* Moved markers array declaration up to line 115
* Added a reset function that resets both the locationset and markers array and resets the list click event handler
* Includes quayzar's jsonpCallback callback

### Version 1.4.3

A minor update with some clean up and additional language options.

**Additions:**

* Added several options for messaging so they can be easily translated into other languages
* Added event namespacing
* Added category to location variables

**Fixes:**

* The distance error would only display "miles" in the alert. It will now show miles or kilometers depending on what the lengthUnit option is set to. 

### Version 1.4.2

This is another minor patch with a few important fixes and one addition. The plugin has also been submitted to the official [jQuery plugin registry](http://plugins.jquery.com/), which is finally back online.

**Additions:**

* Added a "loading" option, which displays a loading gif next to the search button if set to true
* Added missing modal window callback functions

**Fixes:**

* The locationset array wasn't being reset on re-submission, which was a more obvious problem when trying to use the maxDistance option. Accidentally removed in 1.4.1.
* When using the fullMapStart option the map wouldn't center and zoom on closest points after form submission
* Using the fullMapStart and maxDistance options together would cause errors
* Wrapped template loading and the rest of the script in separate functions to ensure that the template files are loaded before the rest of the script runs
* Changed all modal window DIVs to use options for full customization. I thought about having a third template for the modal but it seems like overkill.
* Updated the jQuery version in all the example files to 1.9.1 and switched the source to use the Media Temple CDN version because Google is taking too long to update their version. 

Note that if you try to use the minified version of jQuery 1.9.0 the plugin will error out in Internet Explorer due to the bug described in [ticket 13315](http://bugs.jquery.com/ticket/13315).

### Version 1.4.1

This is a minor patch to switch array declarations to a [faster method](http://jsperf.com/new-array-vs-vs-array), fix line 682 to target with the loc-list setting instead of the div ID, and remove
a duplicate locationset declaration on line 328. 

### Version 1.4

This is a large update that has many updates and improvements. It’s very important to note that the plugin now requires the [Handlebars](http://handlebarsjs.com) template engine. I made this change so that the data that’s displayed in the location list and the infowindows can be easily customized. I also wanted to separate the bulk of the layout additions from the main plugin file. Handlebars pretty slick, will read Mustache templates, and the built-in helpers can really come in handy. Depending on what your data source is, 2 of the 4 total templates will be used (KML vs XML or JSON) and there are options to set the paths of each template if you don’t want them in the default location. If you’re developing something for mobile devices the templates can be pre-compiled for even faster loading. Additionally, I’d also like to note that it probably makes more sense to use KML now as the data source over the other options but I’m definitely leaving XML and JSON support in. XML is still the default datatype but I may switch it to KML in the future.

####New features:####

**Kilometers option**  
This was a no-brainer. You could make the change without too much trouble before but I thought I’d make it easier for the rest of the world.

**Origin marker option**  
If you’d like to show the origin point, the originMarker option should be set to true. The default color is blue but you can also change that with the originpinColor option. I’m actually not positive how many colors Google has available but I know red, green and blue work - I would just try the color you want to see if it works.

**KML support**  
Another obvious add-on. If you’d like to use this plugin with more customized data this would be the method I’d recommend because the templates are simplified to just name and description. So, you could put anything in the descriptions and not have to worry about line by line formatting. This method also allows you to create a map with Google “My Maps” and export the KML for use with this plugin. 

**Better JSONP support and 5 callbacks**  
Thanks to “Blackout” for passing these additions on. It should make working with JSONP easier and the callbacks should be helpful for anyone wanting to hook in add some more advanced customization. 

**ASP.net WebForms support**  
If you’re woking with ASP.net WebForms, including form tags is obviously going to cause some problems. If you’re in this situation simply set the new noForm option to true and make sure the formContainerDiv setting matches your template.

**Maximum distance option**  
You can now easily add a distance dropdown with any options that you’d like. I’ve specifically added a new HTML file as an example. 

**Location limit now supports any number**  
This plugin was previously limited to only display a maximum of 26 locations at one time (based on the English alphabet). You can now set the limit to whatever you’d like and if there are more than 26 it will switch to just show dot markers with numbers in the location list.

**Open with a full map of all locations**  
I had several requests asking how to accomplish this so I’ve added it as an option. There’s a new fullMapStart option that if set to true, will immediately display a map with all locations and the zoom will automatically fit all the markers and center.

**Reciprocal focus**  
“JO” was particularly interested in adding this to the plugin and I finally got around to it. To accomplish reciprocal focus I add an ID to each marker and then add that same ID to each list element in the location list taking advantage of [HTML5’s new data- attributes](http://ejohn.org/blog/html-5-data-attributes). I also added some jQuery to make the location list scroll to the correct position when its marker is clicked on the map. 

**Notes:**

A few option names have changed, so be sure to take note of the changes before updating your files - especially people using JSON data.

I've included a basic [LESS](http://lesscss.org) stylesheet without variables that can be used in place of the main map.css stylesheet. If you want to use it make any changes you want and compile it or include it in your main LESS file.

I’m somewhat concerned about the markers for future versions. Google has deprecated the Image Charts API, which is annoying (they always seem to deprecate the best things), but these should still continue to work for a long time. With that said though, my opinion of the look of Google’s markers is that they’re quite ugly. I was working on adding a new custom markers that could be controlled with CSS via the [Rich Marker utility](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/richmarker/examples/richmarker.html) but I was unable to get that to work with the marker animations. I was also looking into using [Nicolas Mollet’s custom marker icons](http://mapicons.nicolasmollet.com), which look very nice compared to Google’s, but that project is apparently under maintenance until further notice. If you have suggestions on this concern I’d be interested in hearing them.

### Version 1.3.3

Forgot to remove one of the UTF-8 encoding lines in the Geocoder function. 

### Version 1.3.2

Only a few special characters were working with the previous fix. Removed special encoding and all seem to be working now.

### Version 1.3.1

Replaced .serialize with .val on line 169 and added the line directly below, which encodes the string in UTF-8. This should solve special character issues with international addresses. 

### Version 1.3

Added directions links to left column location list and HTML5 geolocation API option. Also did a little cleanup.

### Version 1.2

Added JSON compatibility, distance to location list, and an option for a default location. Also updated jQuery calls to the latest version (1.7.2) and removed an unnecessary line in the process form input function.

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