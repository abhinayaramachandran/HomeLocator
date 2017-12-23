/*
* Web Mashup - Zillow API and Google Maps
*  Abhinaya Ramachandran : 1001268347
*/

// Zillow API
var zwsid = "X1-ZWz1g1mdgb7s3v_8w9nb";


var request = new XMLHttpRequest();


/* Initializing the map to point to a particular lattitude and longitude*/
function initialize() {
              var myLatLng = {lat: 32.75, lng: -97.13};
                    geocoder = new google.maps.Geocoder();
                    map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 17,
                    center: myLatLng
              });

            /* The initial position of the marker is here */
              marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map
              });

             map.addListener('click', function(event) {
                      addMarker(event.latLng);
                    });

            function addMarker(location) {
                    /*Everytime the map is clicked, this function is called
                     * If the listing is available in Zillow API, the position is updated in the map
                    */
                     geocoder.geocode({'location': location}, function(results, status) {
                        var address = results[0].formatted_address;
                        addr = address.split(',', 4);
                        sendRequestbyReverseGeoCoding(addr[0], addr[1], addr[2])
                        });
                  }
}


function markOnMap(address, zestimate) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
            marker.setMap(null);
            var contentString ="<b> Postal address : </b> "+ address + "<br/>" + "<b> Zestimate:</b> $" + zestimate;
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            map.setCenter(results[0].geometry.location);
            marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

            /* The information window opens when the mouse is over the marker */
            marker.addListener('mouseover', function() {
                infoWindow.open(map, marker);
            });
          } else {
            alert('Error using geocode: ' + status);
      }
    });
  }



function displayResult () {
    if (request.readyState == 4) {
        if (request.responseXML == null){
            return 
        }
        var xml = request.responseXML.documentElement;
        if (xml.getElementsByTagName("code")[0].innerHTML == 508 || xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML == ""){
            // alert("Sorry no listings available at this time");
            return
        }
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        var address = xml.getElementsByTagName("response")[0].getElementsByTagName("address")[0];
        var houseInfo = document.createElement('div');
        houseInfo.setAttribute('style','white-space: pre-wrap; border-left: 5px solid white; border-bottom: 2px solid white; background-color: lightgrey;');
        var street =  address.getElementsByTagName("street")[0].innerHTML;
        var city =  address.getElementsByTagName("city")[0].innerHTML;
        var state =  address.getElementsByTagName("state")[0].innerHTML;
        var zipcode =  address.getElementsByTagName("zipcode")[0].innerHTML;
        houseInfo.innerHTML = "Postal Address: " + street+ ", "+ city +", " + state + " "+ zipcode + "\n"+"Zestimate :  $"+ value+ "\n";
        markOnMap(street + " "+ city + " "+ state+ " "+ zipcode, value);
        var output =document.getElementById('output')
        output.insertBefore(houseInfo, output.firstChild);
    }
}



/* Request from the text box*/
function sendRequest () {
    request.onreadystatechange = displayResult;
    var address = document.getElementById("address").value;
    var addr =address.split(",") 
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+addr[0]+"&citystatezip="+addr[1]+"+"+addr[2]);
    request.withCredentials = "true";
    request.send(null);
}


/* Request from the map */

function sendRequestbyReverseGeoCoding (street, city, state_zipcode) {
    request.onreadystatechange = displayResult;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+state_zipcode);
    request.withCredentials = "true";
    request.send(null);
}
