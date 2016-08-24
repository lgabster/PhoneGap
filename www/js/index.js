var app = {
    templates: {
        homeTpl: Handlebars.compile($("#home-tpl").html()),
        productListTpl: Handlebars.compile($("#product-list-tpl").html())
    },
    initialize: function() {
        FastClick.attach(document.body);
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        app.renderHomeView();
        if (navigator.notification) {
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "ShopDash", // title
                    'Continue'        // buttonName
                );
            };
        }
        window.alert('loading App');
        app.loadDoc();
    },
    renderHomeView: function() {
        console.log('renderHOME')
        $('body').html(app.templates.homeTpl());
    },
    loadDoc: function() {
        console.log('loadDoc')
        // $.get("../data/argep.xml", {}, function(data) {
        //     console.log('lllllllllllll')
        //     app.renderHtmlFromXml(data);
        //     console.log('xxxxxxxxxxxxxxx')
        // }, 'xml');

        var jqxhr = $.ajax({
            url: "../data/argep.xml",
            dataType: 'xml'
        }).done(function(data) {
            console.log(data)
            app.renderHtmlFromXml(data);
            console.log('xxxxxxxxxxxxxxx')
        }).fail(function(error) {
            console.log(error)
        });
        jqxhr.always(function() {
            alert( "second complete" );
        });
        console.log('-------------------------')
    },
    renderHtmlFromXml: function(xml) {
        console.log('ASDASD');
        var $xml = $(xml);
        var table="<tr>" +
                "<th>Kép</th>" +
                "<th>Név</th>" +
                "<th>Leírás</th>" +
            "</tr>";
        var $termekek = $xml.find("termek");
        $.each($termekek, function(i, termek) {
            console.log(i);
            var $termek = $(termek);
            var nev        = $termek.find("nev").text();
            var leiras     = $termek.find("leiras").text();
            var fotolink   = $termek.find("fotolink").text();
            var termeklink = $termek.find("termeklink").text();

            table += "<tr>" +
                "<td><img src='" + fotolink + "' width='50'/></td>" +
                "<td><a href='" + termeklink + "'>" + nev + "</a></td>" +
                "<td>" + leiras +"</td>" +
                "</tr>";
        });
        $("#products").html(table);
        console.log($("#products").html());
    }
};
