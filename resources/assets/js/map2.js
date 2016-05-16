/*global $,google */
function initMap() {
    'use strict';
    var  mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(53.0137902, 18.5984437),
            disableDefaultUI: true,
            scrollwheel: true,
            draggable: true,
            zoomControl: true,
            fullscreenControl: true
        },
        mapElement = document.getElementById('map'),
        theMap = new google.maps.Map(mapElement, mapOptions),
        beachMarker = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: []
        },lastmarkerid;

    function lastid(lid) {
        var i = 0,
            opis, repair, pozycja, markertitle, markerid, type, image, typ,
            userid, markerimage, addres, bazamarkerow;
        $.get('lastid/' + lid, function(data) {
            var datl = data.length;
            for (i; i < datl; i++) {
                pozycja = new google.maps.LatLng(data[i].latitude,
                                                 data[i].longitude);
                markertitle = data[i].title;
                markerid = data[i].id;
                type = data[i].type;
                userid = data[i].user_id;
                opis = data[i].opis;
                markerimage = data[i].image;
                repair = data[i].repair;
                addres = data[i].addres;
                image = {
                    url: data[i].gfx,
                    size: new google.maps.Size(40, 40),
                    origin: null,
                    anchor: null
                };
                if (datl - 1 === i) {
                    lastmarkerid = data[i].id;
                }

                bazamarkerow = new google.maps.Marker({
                    position: pozycja,
                    map: theMap,
                    icon: image,
                    title: markertitle,
                    id: markerid,
                    image: markerimage,
                    type: type,
                    opis: opis,
                    repair: repair,
                    addres: addres
                });
                bindInfoWindow(bazamarkerow, theMap);
                typ = bazamarkerow.type;
                beachMarker[typ].push(bazamarkerow);
            }

        });
    }
    lastid(lastmarkerid);
    var bindInfoWindow = function(bazamarkerow, theMap) {
        google.maps.event.addListener(bazamarkerow, 'click', function() {
            var markercontent = '<h4 style="margin:2px ">' +
            bazamarkerow.title + '</h4><p style="margin:0px">' +
            bazamarkerow.opis + '</p>';
            if (bazamarkerow.image !== undefined) {
                var markerimage = '<img src="' +
                    bazamarkerow.image + '" alt="' +
                bazamarkerow.title + '">';
                markercontent = markercontent + markerimage;
            }
            var infowindow = new google.maps.InfoWindow({
                content: markercontent
            });
            infowindow.open(theMap, bazamarkerow);
        });
  
    };


    function toggleGroup(type) {
        var markersInArray=beachMarker[type].length;
        for (var i = 0; i < markersInArray; i++) {
            var marker = beachMarker[type][i];
            if (!marker.getVisible()) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
    }

    function visableOnOf(visable) {
        for (var i = 1; i <= 10; i++) {
            var jd = beachMarker[i].length;
            for (var j = 0; j < jd; j++) {
                var marker = beachMarker[i][j];
                if(visable===0){
                    marker.setVisible(true);
                }else{
                    marker.setVisible(false);
                }
            }
        }
    }
    $('body').on('change', '#cboxLoadedContent input', function () {
        toggleGroup(this.value);
    });
    var idl = document.getElementById('legend');
    theMap.controls[google.maps.ControlPosition.TOP_CENTER].push(idl);
}
   
        function loadScript()
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCYqomDlEk2ZSZ0KeV8LwWdhHHzlJNGhOA&callback=initMap";
  document.body.appendChild(script);
}

window.onload = loadScript;
