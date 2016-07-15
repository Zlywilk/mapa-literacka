/*global $,google */
function initMap() {
  'use strict';
  var mapOptions = {
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
      },lastmarkerid,markerGoPoint,infowindow;

  function lastid(lid) {
    var i = 0,
            description, repair, position, markertitle, markerid, type, image, typ,
            userid, markerimage, addres, MarkeFromDb;
    $.get('lastid/' + lid, function(data) {
      var datl = data.length;
      for (i; i < datl; i++) {
        position = new google.maps.LatLng(data[i].latitude,
            data[i].longitude);
        markertitle = data[i].title;
        markerid = data[i].id;
        type = data[i].type;
        userid = data[i].user_id;
        description = data[i].description;
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

        MarkeFromDb = new google.maps.Marker({
          position: position,
          map: theMap,
          icon: image,
          title: markertitle,
          id: markerid,
          image: markerimage,
          type: type,
          description: description,
          repair: repair,
          addres: addres
        });
        bindInfoWindow(MarkeFromDb, theMap);
        typ = MarkeFromDb.type;
        beachMarker[typ].push(MarkeFromDb);
      }

    });
  }
  lastid(lastmarkerid);
  var bindInfoWindow = function(MarkeFromDb, theMap) {
    google.maps.event.addListener(MarkeFromDb, 'click', function() {
      var MarkerContent = '<h4 style="margin:2px ">' +
          MarkeFromDb.title + '</h4><p style="margin:0px">' +
          MarkeFromDb.description + '</p>';
      if (MarkeFromDb.image !== undefined) {
        var markerimage = '<img src="' +
                    MarkeFromDb.image + '" alt="' +
                MarkeFromDb.title + '">';
        MarkerContent = MarkerContent + markerimage;
      }
         if (infowindow) {
        infowindow.close();
    }
       infowindow = new google.maps.InfoWindow({
        content: MarkerContent
      });

      infowindow.open(theMap, MarkeFromDb);
    });

  };


  function toggleGroup(type) {
    var markersInArray = beachMarker[type].length;
    for (var i = 0; i < markersInArray; i++) {
      var marker = beachMarker[type][i];
      if (!marker.getVisible()) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
  }

  function visibleOnOff(visibleValue) {
    for (var i = 1; i <= 10; i++) {
      var jd = beachMarker[i].length;
      for (var j = 0; j < jd; j++) {
        var marker = beachMarker[i][j];
        if (visibleValue === 0) {
          marker.setVisible(true);
        }else {
          marker.setVisible(false);
        }
      }
    }
  }

    $('a.ajax.cboxElement').colorbox();


  $('body').on('change', '#cboxLoadedContent input', function() {
    toggleGroup(this.value);
  });
  var idl = document.getElementById('legend');
  theMap.controls[google.maps.ControlPosition.TOP_CENTER].push(idl);
$('body').on('click', 'a.go-point', function(e) {
  visibleOnOff(1);
  var goPoint = this.getAttribute('href').split(',');
  var goGPS = new google.maps.LatLng(goPoint[0], goPoint[1]);

  markerGoPoint = new google.maps.Marker({
    position: goGPS,
    map: theMap,
    title: goPoint[2]
  });
  theMap.setCenter(goGPS);
  $(window).colorbox.close();
  e.preventDefault();
});
}
function loadScript()
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCYqomDlEk2ZSZ0KeV8LwWdhHHzlJNGhOA&callback=initMap';
  document.body.appendChild(script);
}

window.onload = loadScript;
