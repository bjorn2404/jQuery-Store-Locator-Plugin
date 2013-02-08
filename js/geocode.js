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

//Process form input
$(function() {
  $('#user-location').on('submit', function(e){
    //Stop the form submission
    e.preventDefault();
    //Get the user input and use it
    var userinput = $('form #address').val();

    if (userinput == "")
      {
        alert("The input box was blank.");
      }
      
      var g = new GoogleGeocode();
      var address = userinput;

      g.geocode(address, function(data) {
        if(data != null) {
          olat = data.latitude;
          olng = data.longitude;
          
          $('#geocode-result').append("Latitude: " + olat + "<br />" + "Longitude: " + olng + "<br /><br />");

        } else {
          //Unable to geocode
          alert('ERROR! Unable to geocode address');
        }
      });

  });
});