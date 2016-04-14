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
        panelname = '<span class="pull-right cancel clickable"><i class="fa fa-times"></i></span>';

    function lastid(lid) {
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
                if (counteditwindows >= 1) {
                var e = 0;
                    var i=0;
                    for (e; counteditwindows >= e; e++) {
                        if ($('.editid').eq(e).val() === bazamarkerow.id.toString()) {
                         ++i;
                        }
                    if(i===0){
                        edit(bazamarkerow);
                    }}
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
                    $('.globalmesage').addClass('alert-success').append('melduje wykonanie zadania markery zostały dodane').fadeIn();
                if (method === "DELETE")
                    $('.globalmesage').addClass('alert-success').append('Bomba usunąłem marker ale już go nie odzyskasz :D').fadeIn();
                if (method === "PATCH")
                    $('.globalmesage').addClass('alert-success').append('exh znów coś chcesz? <br> No nic musze to zrobić w końcu jestem programaem gotowe markery edytowane').fadeIn();
                  if (agr !== undefined) {
                    deletemarker(agr);
                    lastid(lastmarkerid);
                } else {
                     if(method!=="PATCH")
                   { deletemarker("all");
                    lastid(lastmarkerid);}
                }
            }
        }).fail(function (data) {
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
         $form.find('.deltable').val('');
            $form.find('input[type="checkbox"]').prop('checked', false);
            $form.find('.repair').val('0');
        $form.find('.alert-danger').hide();
        $form.find('.alert-danger').empty();
        $form.find('.alert-danger').attr('class', 'error' + iloscokien + ' alert alert-danger');
    }

    function edit($marker) {
if($('.latitude').val()==="")
    {$('.panelholding').removeClass('addnewmarker');
     $('.panel-heading').addClass('edit').html($marker.title + panelname);
    $('.panel-body').find('.btn-group').append('<button type="button" data-dismiss="modal" class="btn btn-sm btn-default destroy" >usuń</button>');
    $('.panel-body').find('.form-group').append('<input class="form-control editid" name="editid"   type="hidden" >');
                $('.panel-body').find('.title').val($marker.title);
        $('.panel-body').find('.addres').val($marker.addres);
        $('.panel-body').find('.opis').val($marker.opis);
        $('.panel-body').find('.editid').val($marker.id);
        $('.panel-body').find('.send').removeClass('send').addClass('editsend');
        $('.panel-body').find('.type').val($marker.type);
        $('.panel-body').find('.repair').val($marker.repair);
        $('.panel-body').find('.latitude').val($marker.position.lat());
        $('.panel-body').find('.longitude').val($marker.position.lng());

    }else
{        var editmenu = $('.panelholding:first').clone();
 if(editmenu.hasClass('addnewmarker')){
             editmenu.find('.btn-group').append('<button type="button" data-dismiss="modal" class="btn btn-sm btn-default destroy" >usuń</button>');
        editmenu.find('.form-group').append('<input class="form-control editid" name="editid"   type="hidden" >');
 }
         editmenu.removeClass('addnewmarker');
        editmenu.find('.panel-heading').addClass('edit').html($marker.title + panelname);

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
        restoreerror(editmenu);}
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
            iloscokienmarkrów = $('.addnewmarker').length,
            iloscokien = $('.panelholding').length,
            markeraddmenu=$('.panelholding:first').clone(),
            marker = new google.maps.Marker({
                id: iloscokien,
                position: location,
                label: labels[labelIndex++ % labels.length],
                map: map,
                draggable: true
            });



        markersadd.push(marker);
        theMap.setCenter(location);
        google.maps.event.addListener(marker, 'dragend', function (event) {
            var id = this.id;
            getgeo(event.latLng, 0, id);
        });


        if (iloscokienmarkrów >= 0) {
            if(markeraddmenu.find('.panel-heading:first').hasClass('edit')){
                markeraddmenu.addClass('addnewmarker');
                markeraddmenu.find('.edit').removeClass('edit');
                markeraddmenu.find('.destroy').remove();
                 markeraddmenu.find('.editsend').attr('class','btn btn-sm btn-default clickable send');
                           markeraddmenu.find('.panel-heading').html('marker' + panelname);
                $('.editid').remove();
            }
               $('.all').before(markeraddmenu);
                getgeo(location, 0, iloscokien);
                 restoreerror(markeraddmenu);
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
                formallcalue = $('.addnewmarker');
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
                    sendajax(datatojson, 'PATCH',formcloseid);

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

/*!
	Colorbox 1.6.3
	license: MIT
	http://www.jacklmoore.com/colorbox
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(A+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in x[0]&&!x[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),x.focus())}function c(t){c.str!==t&&(x.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){A=0,e&&e!==!1&&"nofollow"!==e?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),A=W.index(_.el),-1===A&&(W=W.add(_.el),A=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data(Y),_=new r(i,o),g(_.get("rel")),!$){$=q=!0,c(_.get("className")),x.css({visibility:"hidden",display:"block",opacity:""}),I=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(I),j=T.height()+k.height()+b.outerHeight(!0)-b.height(),D=C.width()+H.width()+b.outerWidth(!0)-b.width(),N=I.outerHeight(!0),z=I.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=Math.max((l!==!1?Math.min(h,a(l,"x")):h)-z-D,0),_.h=Math.max((f!==!1?Math.min(s,a(f,"y")):s)-N-j,0),I.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(F).hide(),x.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}var p=parseFloat(_.get("opacity"));v.css({opacity:p===p?p:"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){x||(V=!1,E=t(i),x=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),L=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),y=n(se,"Wrapper"),b=n(se,"Content").append(F=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),S=n("button","Slideshow"),L),B=t('<button type="button"/>').attr({id:Z+"Close"}),y.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(S)),e.body&&!x.parent().length&&t(e.body).append(v,x.append(y,M))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return x?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;$&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),$&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if(q=!0,U=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-N-j:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-z-D:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-z-D,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-N-j,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){L.show()},100),_.get("inline")){var c=t(e);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),U=_.get("createImg"),t(U).addClass(Z+"Photo").bind("error."+Z,function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;_.get("retinaImage")&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){U.height-=U.height*e,U.width-=U.width*e},_.mw&&U.width>_.mw&&(e=(U.width-_.mw)/U.width,o()),_.mh&&U.height>_.mh&&(e=(U.height-_.mh)/U.height,o())),_.h&&(U.style.marginTop=Math.max(_.mh-U.height,0)/2+"px"),W[1]&&(_.get("loop")||W[A+1])&&(U.style.cursor="pointer",t(U).bind("click."+Z,function(){J.next()})),U.style.width=U.width+"px",U.style.height=U.height+"px",h(U)},1)}),U.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,x,y,b,T,C,H,k,W,E,I,M,L,F,R,S,K,P,B,O,_,j,D,N,z,A,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title},createImg:function(){var e=new Image,i=t(this).data("cbox-img-attrs");return"object"==typeof i&&t.each(i,function(t,i){e[t]=i}),e},createIframe:function(){var i=e.createElement("iframe"),n=t(this).data("cbox-iframe-attrs");return"object"==typeof n&&t.each(n,function(t,e){i[t]=e}),"frameBorder"in i&&(i.frameBorder=0),"allowTransparency"in i&&(i.allowTransparency="true"),i.name=(new Date).getTime(),i.allowFullscreen=!0,i}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[A+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){S.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),x.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),S.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),x.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,S.hide(),t(),ae.unbind(ne,e).unbind(ie,t),x.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),S.show())}}();t[Y]||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;return e=e||{},t.isFunction(o)&&(o=t("<a/>"),e.open=!0),o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(x[0].style.width,10)-D+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(x[0].style.height,10)-j+"px"}var r,h,s,l=0,d=0,c=x.offset();if(E.unbind("resize."+Z),x.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,x.css({position:"fixed"})):(l=h,d=s,x.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-z-D-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-z-D,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-N-j-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-N-j,0)/2),x.css({top:c.top,left:c.left,visibility:"visible"}),y[0].style.width=y[0].style.height="9999px",r={width:_.w+z+D,height:_.h+N+j,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||x.css(r),x.dequeue().animate(r,{duration:e||0,complete:function(){n(),q=!1,y[0].style.width=_.w+z+D+"px",y[0].style.height=_.h+N+j+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),t.isFunction(i)&&i()},step:n})},J.resize=function(t){var e;$&&(t=t||{},t.width&&(_.w=a(t.width,"x")-z-D),t.innerWidth&&(_.w=a(t.innerWidth,"x")),I.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-N-j),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=I.scrollTop(),I.css({height:"auto"}),_.h=I.height()),I.css({height:_.h}),e&&I.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||I.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||I.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if($){var d,g="none"===_.get("transition")?0:_.get("speed");I.remove(),I=n(se,"LoadedContent").append(i),I.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(U).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&x[0].style.removeAttribute("filter")}var n,o,a=W.length;$&&(o=function(){clearTimeout(Q),L.hide(),u(ne),_.get("onComplete")},F.html(_.get("title")).show(),I.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",A+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>A?"show":"hide"]().html(_.get("next")),P[_.get("loop")||A?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=_.get("createIframe"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),"class":Z+"Iframe"}).one("load",o).appendTo(I),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?x.fadeTo(g,1,i):i())},"fade"===_.get("transition")?x.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!q&&W[1]&&(_.get("loop")||W[A+1])&&(A=h(1),f(W[A]))},J.prev=function(){!q&&W[1]&&(_.get("loop")||A)&&(A=h(-1),f(W[A]))},J.close=function(){$&&!G&&(G=!0,$=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),x.stop().fadeTo(_.get("fadeOut")||0,0,function(){x.hide(),v.hide(),u(he),I.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){x&&(x.stop(),t[Y].close(),x.stop(!1,!0).remove(),v.remove(),G=!1,x=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z).unbind("keydown."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);
//# sourceMappingURL=all.js.map
