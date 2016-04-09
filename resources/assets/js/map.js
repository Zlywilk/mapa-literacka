function init() {
    "use strict";
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        labelIndex = 0,
        geocoder = new google.maps.Geocoder(),
        mapOptions = {
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
        },
        markersadd = [],
        lastmarkerid = null,
        panelname = '<span class="pull-right clickable"><i class="fa fa-times"></i></span>';

    function lastid(lastmarkerid) {
        var i = 0,
            opis, repair, pozycja, markertitle, markerid, type, image, typ, userid, markerimage, addres, bazamarkerow;
        $.get('lastid/' + lastmarkerid, function (data, status) {
            var datl = data.length;
            for (i; i < datl; i++) {
                pozycja = new google.maps.LatLng(data[i].latitude, data[i].longitude);
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
    var bindInfoWindow = function (bazamarkerow, theMap) {
        google.maps.event.addListener(bazamarkerow, 'click', function () {
            var markercontent = '<h4 style="margin:2px ">' + bazamarkerow.title + '</h4><p style="margin:0px">' + bazamarkerow.opis + '</p>';
            if (bazamarkerow.image !== undefined) {
                var markerimage = '<img src="' + bazamarkerow.image + '" alt="' + bazamarkerow.title + '">';
                markercontent = markercontent + markerimage;
            }
            var infowindow = new google.maps.InfoWindow({
                content: markercontent
            });
            infowindow.open(theMap, bazamarkerow);
            if ($('#roleid').val() === "2" || $('#userid').val() === bazamarkerow.userid)

            {
                var editid = $('.panelholding').length;
                bazamarkerow.setDraggable(true);
                var counteditwindows = $('.edit').length;
                if (counteditwindows > 0) {
                    var e = 0;
                    for (e; counteditwindows >= e; e++) {
                        if ($('.editid').eq(e).val() !== bazamarkerow.id.toString()) {
                            if (e === counteditwindows)
                                bazamarkerow.editid = editid;
                            edit(bazamarkerow);
                        } else {
                            return;
                        }

                    }
                } else {
                    {
                        bazamarkerow.editid = editid;
                        edit(bazamarkerow);
                    }
                }
            } else {
                bazamarkerow.setDraggable(false);
            }

        });
        google.maps.event.addListener(bazamarkerow, 'dragend', function (event) {
            var editid = this.editid;
            getgeo(event.latLng, 0, editid);
        });
    };

    function toggleGroup(type) {
        for (var i = 0; i < beachMarker[type].length; i++) {
            var marker = beachMarker[type][i];
            if (!marker.getVisible()) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        }
    }

    function visableAll() {
        for (var i = 1; i < 10; i++) {
            var jd = beachMarker[i].length;
            for (var j = 0; j < jd; j++) {
                var marker = beachMarker[i][j];
                if (!marker.getVisible()) {
                    marker.setVisible(true);
                }
            }
        }
    }
    $('body').on('change', '#cboxLoadedContent input', function () {
        toggleGroup(this.value);
    });
    var idl = document.getElementById('legend');
    theMap.controls[google.maps.ControlPosition.TOP_CENTER].push(idl);
    $('#toggle').click(function () {
        $('#sidebar-wrapper').toggleClass('hide');
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('.ajax').on('click', function (e) {
        e.preventDefault();
        $('.ajax').colorbox({
            top: 50,
            left: 50
        });
        visableAll();
    });

    function sendajax(formdata, method) {
        if (arguments[2] !== undefined)
            var agr = arguments[2];
        $.ajax({
            type: method,
            url: 'markers',
            contentType: 'aplication/json',
            data: formdata,
            success: function (data) {
                if (method === "POST")
                    $('.globalmesage').addClass('alert-success').html('melduje wykonanie zadania markery zostały dodane').fadeIn();
                if (method === "DELETE")
                    $('.globalmesage').addClass('alert-success').html('Bomba usunąłem marker ale już go nie odzyskasz :D').fadeIn();
                if (method === "PATCH")
                    $('.globalmesage').addClass('alert-success').html('exh znów coś chcesz? <br> No nic musze to zrobić w końcu jestem programaem gotowe markery edytowane').fadeIn();
                if (agr !== undefined) {
                    if(agr !=="a")
          {          deletemarker(agr);
                    lastid(lastmarkerid);}
                } else {
                    deletemarker("all");
                    lastid(lastmarkerid);
                }
            }
        }).error(function (data) {
            if (data.status === 500) {
                $('.globalmesage').addClass('alert-danger').html('coś poszło nie tak nasze minionki juz pracują nad rozwizaniem problemu :)').fadeIn();
                return;
            }
            var errors = data.responseJSON;
            $.each(errors, function (index, value) {
                var split = index.split('.');
                if (agr !== undefined)
                    split[1] = agr;

                if (split[1] === undefined) {
                    split[1] = 0;
                }
                $('.error' + split[1]).append(value);
                $('.error' + split[1]).fadeIn();
            });
        });
    }

    function restoreerror($form) {
        var iloscokien = $('.panelholding').length;
        $('.panelholding:last').attr('id', iloscokien-1);
        $form.find('.alert-danger').hide();
        $form.find('.alert-danger').empty();
        $form.find('.alert-danger').attr('class', 'error' + iloscokien + ' alert alert-danger');
    }

    function edit($marker) {

        var editmenu = $('.panelholding:first').clone();
         editmenu.removeClass('addnewmarker');
        editmenu.find('.panel-heading').addClass('edit').html($marker.title + panelname);
        editmenu.find('.btn-group').append('<button type="button" data-dismiss="modal" class="btn btn-sm btn-default destroy" >usuń</button>');
        editmenu.find('.form-group').append('<input class="form-control editid" name="editid"   type="hidden" >');

        editmenu.find('.title').val($marker.title);
        editmenu.find('.addres').val($marker.addres);
        editmenu.find('.opis').val($marker.opis);
        editmenu.find('.editid').val($marker.id);
        editmenu.find('.send').removeClass('send').addClass('editsend');
        editmenu.find('.type').val($marker.type);
        editmenu.find('.repair').val($marker.repair);
        editmenu.find('.latitude').val($marker.position.lat());
        editmenu.find('.longitude').val($marker.position.lng());
        $('.all').before(editmenu);
        restoreerror(editmenu);
        $('body').on('click', '.destroy', function (e) {
            e.preventDefault();
            var $markerid = $(this).closest('.panel-body').find('.editid').val();
            var $panel = $(this).closest('.panelholding');
            $('.modal').modal()
                .one('click', '#destroy', function (e) {
                    sendajax($markerid, 'DELETE');
                    $('.globalmesage').addClass('alert-success').html('Bomba usunąłem marker ale już go nie odzyskasz :D').fadeIn();
                    $marker.setMap(null);
                    $('.close').click();

                });
        });
    }

    function getgeo(pos, typ, id) {
        var geotype, byaddress;
        if (typeof pos == 'string') {
            geotype = {
                'address': pos
            };
            byaddress = 1;

        } else {
            geotype = {
                'latLng': pos
            };
            byaddress = 0;
        }
        geocoder.geocode(geotype, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (byaddress === 1) {
                    addMarker(results[0].geometry.location, theMap);
                    return;
                }
                theMap.setCenter(results[0].geometry.location);
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                $("input[name='latitude']").eq(id).val(lat);
                $("input[name='longitude']").eq(id).val(lng);
                $('.addres').eq(id).val(results[0].formatted_address);
            }
        });
    }

    function removevalue() {
        $('.panel-heading').eq(0).html('marker' + panelname);
        $('.deltable').val('');
        $('input[type="checkbox"]').prop('checked', false);
        $('.repair').val(0);
        $('.type').val(null);
    }

    function deletemarker(index) {
        var formclose = $('.panelholding'),
            iloscpaneli = formclose.length;
        if (index === "all") {
            var addnewmarker = $('.addnewmarker');
            addnewmarker.each(function (index) {
                markersadd[index].setMap(null);
            });

            for (var i = 1; i < iloscpaneli; i++) {
                formclose.eq(i).remove();

            }
            removevalue();
            if (markersadd.length > 0)
                markersadd[0].setMap(null);
            markersadd.splice(0, iloscpaneli);
            labelIndex = 0;
            return;
        }
        if (iloscpaneli === 1) {
            removevalue();
            if (markersadd.length === 1)
                markersadd[index].setMap(null);
            markersadd.splice(index, 1);
            labelIndex = 0;
            return;
        }
        $(index).fadeOut();
        formclose[index].remove();
        if (markersadd.length >= 1)
            markersadd[index].setMap(null);
        markersadd.splice(index, 1);
        var e = index,
            panelclose = $('.panelholding'),
            countpanels = panelclose.length;
        for (e; e < countpanels; e++) {
            panelclose.eq(e).attr('id', e);
            markersadd[e].id = e;
        }
    }

    function addMarker(location, map) {
        var iloscmarkerow = markersadd.length,
            marker = new google.maps.Marker({
                id: iloscmarkerow,
                position: location,
                label: labels[labelIndex++ % labels.length],
                map: map,
                draggable: true
            });

        getgeo(location, 0, iloscmarkerow);

        markersadd.push(marker);
        theMap.setCenter(location);
        google.maps.event.addListener(marker, 'dragend', function (event) {
            var id = this.id;
            getgeo(event.latLng, 0, id);
        });

        var iloscokien = $('.panelholding').length;
        $('#sidebar-wrapper').removeClass('hide');
        if (iloscmarkerow >= 1) {
            var markeraddmenu = $('.panelholding:first').clone();
            markeraddmenu.find('.panel-heading').html('marker' + panelname);
            restoreerror(markeraddmenu);
            markeraddmenu.find('.deltable').val('');
            markeraddmenu.find('input[type="checkbox"]').prop('checked', false);
            markeraddmenu.find('.repair').val('0');
            $('.all').before(markeraddmenu);
        }
    }
    if ($('.city').html() === 'Idź do UL.') {
        $('body').on('change', '.required', function () {
            var fclosed = $(this).closest('.panel-body');
            if (this.type === 'text')
                fclosed.prev().html(this.value + panelname);
            fclosed.find('.alert-danger').fadeOut();

        });
        google.maps.event.addListener(theMap, 'click', function (event) {
            addMarker(event.latLng, theMap);
        });
        $('.city').click(function (e) {
            e.preventDefault();
            var city = $('#city').val() + ',87-100 Toruń';
            getgeo(city, 1);
        });
        $('body').on('click', '.panel-heading', function () {
            $(this).next('div').slideToggle('slow');
        });
        $('body').on('click', '.clickable', function (e) {
            var formclose = $(this).closest('.panelholding'),
                formcloseid = formclose.attr('id'),
                formallcalue = $('.panelholding');
            e.preventDefault();
            if ($(this).hasClass('cancel')) {
                deletemarker(formcloseid);
            } else if ($(this).hasClass('cancelall')) {
                deletemarker("all");
            } else if ($(this).hasClass('send')) {

                formclose.find('.alert-danger').empty();
                var data = JSON.stringify(formclose.serializeObject());
                sendajax(data, 'post', formcloseid);
            } else if ($(this).hasClass('sendall')) {
                $('.alert').fadeOut('fast', function () {
                    $(this).html('');
                });
                $('.globalmesage').removeClass('alert-success, alert-danger');
        
                var sendata = JSON.stringify(formallcalue.serializeObject());
                sendajax(sendata, 'post');
                var countofedit=$('.edit').length ;
                        if (countofedit> 0) {
                    var datafromedit=$('.edit').next();
                    var datatojson = JSON.stringify(datafromedit.serializeObject());
                            if(countofedit===formallcalue.length)
                    {
                        sendajax(datatojson, 'PATCH');
                    }
                            else{
                                sendajax(datatojson, 'PATCH','a');
                            }
                }
            } else if ($(this).hasClass('editsend')) {
                var $markerid = $(this).closest('.panel-body').find('.editid').val();
                var $panel = $(this).closest('.panelholding');
                var dataedit= JSON.stringify($panel.serializeObject());

                sendajax(dataedit, 'PATCH');
            }
        });
        $('body').on('change', 'input[type="checkbox"]', function () {
            $(this).val(this.checked ? 1 : 0);
        });
        $.fn.serializeObject = function () {
            var o = {};
            var rules = 'input[type="hidden"], input[type="text"], input[type="password"]';
            rules += ',input[type="checkbox"], input[type="radio"]:checked';
            rules += ',select, textarea, input[type="file"] ';
            $(this).find(rules).each(function () {
                if ($(this).attr('type') == 'hidden') {
                    var $parent = $(this).parent();
                    var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '"]');
                    if ($chb !== null) {
                        if ($chb.prop('checked')) return;
                    }
                }
                if (this.name === null || this.name === undefined || this.name === '')
                    return;
                var elemValue = null;
                if ($(this).is('select'))
                    elemValue = $(this).find('option:selected').val();
                else elemValue = this.value;
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(elemValue || '');
                } else {
                    o[this.name] = elemValue || '';
                }
            });
            return o;
        };
    }
    theMap.controls[google.maps.ControlPosition.TOP_LEFT].push();
}
google.maps.event.addDomListener(window, 'load', init);