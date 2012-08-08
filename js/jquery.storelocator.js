/*
* storeLocator v1.3.3 - jQuery store locator plugin
* (c) Copyright 2012, Bjorn Holine (http://www.bjornblog.com)
* Released under the MIT license
* Distance calculation function by Chris Pietschmann: http://pietschsoft.com/post/2008/02/01/Calculate-Distance-Between-Geocodes-in-C-and-JavaScript.aspx
*/

(function($){
$.fn.storeLocator = function(options) {

  var settings = $.extend( {
      'mapDiv'        : 'map',
      'listDiv'       : 'list',
      'formID'        : 'user-location',
      'inputID'       : 'address',
      'zoomLevel'     : 12,
      'pinColor'      : 'fe7569',
      'pinTextColor'  : '000000',
      'storeLimit'    : 26,
      'distanceAlert' : 60,
      'dataLocation'  : 'locations.xml',
      'listColor1'    : 'ffffff',
      'listColor2'    : 'eeeeee',
      'bounceMarker'  : true,
      'slideMap'      : true,
      'modalWindow'   : false,
      'defaultLoc'    : false,
      'defaultLat'    : '',
      'defaultLng'    : '',
      'jsonData'      : false,
      'autoGeocode'   : false
  }, options);

  return this.each(function() {

  var $this = $(this);

  //Add modal window divs if set
  if(settings.modalWindow == true)
  {
    $this.wrap('<div id="overlay"><div id="modal-window"><div id="modal-content">');
    $('#modal-window').prepend('<div id="close-icon"><\/div>');
    $('#overlay').hide();
  }

  if(settings.slideMap == true)
  {
    //Let's hide the map container to begin
    $this.hide();
  }

  var userinput, olat, olng, marker, letter, storenum;
  var locationset = new Array();

  //Calculate geocode distance functions - you could use Google's distance service instead
  var GeoCodeCalc = {};
  GeoCodeCalc.EarthRadiusInMiles = 3956.0;
  GeoCodeCalc.EarthRadiusInKilometers = 6367.0;
  GeoCodeCalc.ToRadian = function(v) { return v * (Math.PI / 180);};
  GeoCodeCalc.DiffRadian = function(v1, v2) {
  return GeoCodeCalc.ToRadian(v2) - GeoCodeCalc.ToRadian(v1);
  };
  GeoCodeCalc.CalcDistance = function(lat1, lng1, lat2, lng2, radius) {
  return radius * 2 * Math.asin( Math.min(1, Math.sqrt( ( Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(GeoCodeCalc.ToRadian(lat1)) * Math.cos(GeoCodeCalc.ToRadian(lat2)) * Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lng1, lng2)) / 2.0), 2.0) ) ) ) );
  };

  //Geocode function for the origin location
  function GoogleGeocode() {
  geocoder = new google.maps.Geocoder();
  this.geocode = function(address, callbackFunction) {
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var result = {};
          result.latitude = results[0].geometry.location.lat();
          result.longitude = results[0].geometry.location.lng();
          callbackFunction(result);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
          callbackFunction(null);
        }
      });
  };
}

  //Reverse geocode to get address for automatic options needed for directions link
  function ReverseGoogleGeocode() 
  {
    geocoder = new google.maps.Geocoder();
    this.geocode = function(latlng, callbackFunction) {
        geocoder.geocode( {'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var result = {};
                result.address = results[0].formatted_address;
                callbackFunction(result);
            }
          } else {
            alert("Geocode was not successful for the following reason: " + status);
            callbackFunction(null);
          }
        });
    };
  }

  //If a default location is set
  if(settings.defaultLoc == true)
  {
      //The address needs to be determined for the directions link
      var r = new ReverseGoogleGeocode();
      var latlng = new google.maps.LatLng(settings.defaultLat, settings.defaultLng);
      r.geocode(latlng, function(data) {
        if(data != null) {
          var originAddress = data.address;
          mapping(settings.defaultLat, settings.defaultLng, originAddress);
        } else {
          //Unable to geocode
          alert('Unable to find address');
        }
      });
  }

  //HTML5 geolocation API option
  if(settings.autoGeocode == true)
  {
      if (navigator.geolocation) 
      {
        navigator.geolocation.getCurrentPosition(autoGeocode_query, autoGeocode_error);
      }
  }

  //If location is detected automatically
  function autoGeocode_query(position)
  {
     //The address needs to be determined for the directions link
      var r = new ReverseGoogleGeocode();
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      r.geocode(latlng, function(data) {
        if(data != null) {
          var originAddress = data.address;
          mapping(position.coords.latitude, position.coords.longitude, originAddress);
        } else {
          //Unable to geocode
          alert('Unable to find address');
        }
      });
  }

  function autoGeocode_error(error)
  {
    //If automatic detection doesn't work show an error
    alert("Automatic location detection failed. Please fill in your address or zip code.");
  }

  //Used to round miles to display
  function roundNumber(num, dec) 
  {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
  }

  //Process form input
  $(function() {
    $(document).on('submit', '#' + settings.formID, function(e){
      //Stop the form submission
      e.preventDefault();
      //Get the user input and use it
      var userinput = $('#' + settings.formID + ' #' + settings.inputID).val();

      if (userinput == "")
        {
          //Show alert and stop processing
          alert("The input box was blank.");
        }
        else
        {
          var g = new GoogleGeocode();
          var address = userinput;
          g.geocode(address, function(data) {
            if(data != null) {
              olat = data.latitude;
              olng = data.longitude;
              mapping(olat, olng, userinput);
            } else {
              //Unable to geocode
              alert('ERROR! Unable to geocode address');
            }
          });
        }

    });
  });


  //Now all the mapping stuff
  function mapping(orig_lat, orig_lng, origin){
  $(function(){

        var dataType;

        //JSON or XML?
        if(settings.jsonData == true){ dataType = "json"; }
        else{ dataType = "xml"; }

        $.ajax({
        type: "GET",
        url: settings.dataLocation,
        dataType: dataType,
        success: function(data) {
          
            //After the store locations file has been read successfully
            var i = 0;

            //Depending on your data strucutre and what you want to include in the maps, you may need to change the following variables or comment them out
            if(settings.jsonData == true)
            {
              //Process JSON
              $.each(data, function() {

                var name = this.locname;
                var lat = this.lat;
                var lng = this.lng;
                var address = this.address;
                var address2 = this.address2;
                var city = this.city;
                var state = this.state;
                var postal = this.postal;
                var phone = this.phone;
                var web = this.web;
                web = web.replace("http://","");
                var hours1 = this.hours1;
                var hours2 = this.hours2;
                var hours3 = this.hours3;

                var distance = GeoCodeCalc.CalcDistance(orig_lat,orig_lng,lat,lng, GeoCodeCalc.EarthRadiusInMiles);
                
                //Create the array
                locationset[i] = new Array (distance, name, lat, lng, address, address2, city, state, postal, phone, web, hours1, hours2, hours3);

                i++;
              });
            }
            else
            {
              //Process XML
              $(data).find('marker').each(function(){
                //Take the lat lng from the user, geocoded above
                var name = $(this).attr('name');
                var lat = $(this).attr('lat');
                var lng = $(this).attr('lng');
                var address = $(this).attr('address');
                var address2 = $(this).attr('address2');
                var city = $(this).attr('city');
                var state = $(this).attr('state');
                var postal = $(this).attr('postal');
                var phone = $(this).attr('phone');
                var web = $(this).attr('web');
                web = web.replace("http://","");
                var hours1 = $(this).attr('hours1');
                var hours2 = $(this).attr('hours2');
                var hours3 = $(this).attr('hours3');

                var distance = GeoCodeCalc.CalcDistance(orig_lat,orig_lng,lat,lng, GeoCodeCalc.EarthRadiusInMiles);
                
                //Create the array
                locationset[i] = new Array (distance, name, lat, lng, address, address2, city, state, postal, phone, web, hours1, hours2, hours3);

                i++;
              });
            }
          
          //Sort the multi-dimensional array numerically
          locationset.sort(function(a, b) {
            var x = a[0];
            var y = b[0];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });

          //Check the closest marker
          if(locationset[0][0] > settings.distanceAlert)
          {
            alert("Unfortunately, our closest location is more than " + settings.distanceAlert + " miles away.");
          }
          
          //Create the map with jQuery
          $(function(){ 

              var storeDistance, storeName, storeAddress1, storeAddress2, storeCity, storeState, storeZip, storePhone, storeWeb, storeHours1, storeHours2, storeHours3;

              //Instead of repeating the same thing twice below
              function create_store_variables(loopcount)
              {
                storeDistance = locationset[loopcount][0];
                storeName = locationset[loopcount][1];
                storeAddress1 = locationset[loopcount][4];
                storeAddress2 = locationset[loopcount][5];
                storeCity = locationset[loopcount][6];
                storeState = locationset[loopcount][7];
                storeZip = locationset[loopcount][8];
                storePhone = locationset[loopcount][9];
                storeWeb = locationset[loopcount][10];
                storeHours1 = locationset[loopcount][11];
                storeHours2 = locationset[loopcount][12];
                storeHours3 = locationset[loopcount][13];

                storeDistance = roundNumber(storeDistance,2);
              }

              //Google maps settings
              var myOptions = {
                zoom: settings.zoomLevel,
                center: new google.maps.LatLng(orig_lat, orig_lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };

              if(settings.slideMap == true)
              {
                //Slide in the map container
                $this.slideDown();
              }
              if(settings.modalWindow == true)
              {
                //Pop up the modal window
                $('#overlay').fadeIn();
                //Close modal when close icon is clicked
                $(document).on('click', '#close-icon', function(){
                    $('#overlay').hide();
                });
                //Close modal when background overlay is clicked
                $(document).on('click', '#overlay', function(){
                    $('#overlay').hide();
                });
                //Prevent clicks within the modal window from closing the entire thing
                $(document).on('click', '#modal-window', function(e){
                    e.stopPropagation();
                });
                //Close modal when escape key is pressed
                $(document).keyup(function(e){
                  if (e.keyCode == 27) { 
                    $('#overlay').hide();
                  }
                });
              }
              var map = new google.maps.Map(document.getElementById(settings.mapDiv),myOptions);      
              var markers = new Array();
              //Create one infowindow to fill later
              var infowindow = new google.maps.InfoWindow();

              //Avoid error if number of locations is less than the default of 26
              if((locationset.length-1) < settings.storeLimit-1)
              {
                storenum = locationset.length-1;
              }
              else
              {
                storenum = settings.storeLimit-1;
              }
              
              //Add markers and infowindows loop
              for (var y = 0; y <= storenum; y++) 
              { 
                var letter = String.fromCharCode("A".charCodeAt(0) + y);
                var point = new google.maps.LatLng(locationset[y][2], locationset[y][3]);             
                marker = createMarker(point, locationset[y][1], locationset[y][4], letter);
                markers[y] = marker;
                //Pass variables to the pop-up info windows
                create_store_variables(y);
                create_infowindow(marker, storeName, storeAddress1, storeAddress2, storeCity, storeState, storeZip, storePhone, storeWeb, storeHours1, storeHours2, storeHours3); 
               }
               
               //Creat the links that focus on the related marker
               $("#" + settings.listDiv).empty();
               $(markers).each(function(x, marker){
                //Let's decleare the store variables again to make it easier to read the html below - there's probably a better way to do this
                var letter = String.fromCharCode("A".charCodeAt(0) + x);
                create_store_variables(x);
                //This needs to happen outside the loop or there will be a closure problem with creating the infowindows attached to the list click
                listClick(storeDistance, letter, marker, storeName, storeAddress1, storeAddress2, storeCity, storeState, storeZip, storePhone, storeWeb, storeHours1, storeHours2, storeHours3);

              });

              function listClick(distance, letter, marker, name, address1, address2, city, state, zip, phone, web, hours1, hours2, hours3)
              {
                var distLength;
                if(distance <= 1){ distLength = "mile"; }
                else{ distLength = "miles"; }

                var fullAddress = address1 + " " + address2 + ", " + city + ", " + state + " " + zip;
                var distLink = "<a href=\"http://maps.google.com/maps?saddr=" + origin + "&daddr=" + fullAddress + "\" target=\"_blank\">Directions<\/a>";

                $('<li />').html("<div class=\"list-label\">" + letter + "<\/div><div class=\"list-details\"><div class=\"list-content\"><div class=\"loc-name\">" + storeName + "<\/div> <div class=\"loc-addr\">" + storeAddress1 + "<\/div> <div class=\"loc-addr2\">" + storeAddress2 + "<\/div> <div class=\"loc-addr3\">" + storeCity + ", " + storeState + " " + storeZip + "<\/div> <div class=\"loc-phone\">" + storePhone + "<\/div> <div class=\"loc-web\"><a href=\"http://" + storeWeb + "\" target=\"_blank\">" + storeWeb + "</a><\/div><div class=\"loc-dist\">" + distance + " " + distLength + "<\/div><div class=\"loc-directions\">" + distLink + "<\/div><\/div><\/div>").click(function(){
                  map.panTo(marker.getPosition());
                  var listLoc = "left";
                  if(settings.bounceMarker == true)
                    {
                      marker.setAnimation(google.maps.Animation.BOUNCE) 
                      setTimeout(function() { marker.setAnimation(null); create_infowindow(marker, name, address1, address2, city, state, zip, phone, web, hours1, hours2, hours3, listLoc); }, 700);
                    }
                    else
                    {
                      create_infowindow(marker, name, address1, address2, city, state, zip, phone, web, hours1, hours2, hours3, listLoc);
                    }
                   
                  }).appendTo("#" + settings.listDiv);
              }

              //Add the list li background colors
              $("#" + settings.listDiv + " li:even .list-details").css('background', "#" + settings.listColor1);
              $("#" + settings.listDiv + " li:odd .list-details").css('background', "#" + settings.listColor2);
               
              //Custom marker function - alphabetical
              function createMarker(point, name, address, letter) {
                //Set up pin icon with the Google Charts API for all of our markers
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + letter + "|" + settings.pinColor + "|" + settings.pinTextColor,
                  new google.maps.Size(21, 34),
                  new google.maps.Point(0,0),
                  new google.maps.Point(10, 34));
                var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                  new google.maps.Size(40, 37),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(12, 35));
                
                //Create the markers
               var marker = new google.maps.Marker({
                    position: point, 
                    map: map,
                    icon: pinImage,
                    shadow: pinShadow,
                    draggable: false
                });

                return marker;
              }

              //Let's save some space - creates and address line if the variable is set
              function address_line(addressSegment)
              {
                var addressLine;

                if(addressSegment != "")
                {
                  addressLine = "<div>" + addressSegment + "<\/div>";
                }
                else
                {
                  addressLine = "";
                }

                return addressLine;
              }

              //Infowindows
              function create_infowindow(marker, name, address1, address2, city, state, zip, phone, web, hours1, hours2, hours3, location)
              {

                var formattedAddress = "<div class=\"loc-name\">" + name + "<\/div>" + address_line(address1) + address_line(address2) + city + ", " + state + " " + zip + address_line(hours1) + address_line(hours2) + address_line(hours3) + address_line(phone) + "<div><a href=\"http://" + web + "\" target=\"_blank\">" + web + "<\/a><\/div>";
                
                //Opens the infowindow when list item is clicked
                if(location == "left")
                {
                    infowindow.setContent(formattedAddress);
                    infowindow.open(marker.get(settings.mapDiv), marker);
                }
                //Opens the infowindow when the marker is clicked
                else
                {
                  google.maps.event.addListener(marker, 'click', function() {
                      infowindow.setContent(formattedAddress);
                      infowindow.open(marker.get(settings.mapDiv), marker);
                  })
                }
              }

          });
        }   
      });
    });
  }

  });
};
})(jQuery);