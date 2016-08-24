/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.showAlert('My notification message...\nsdffdssdf', 'Noti Title');
        this.registerEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    registerEvents: function () {
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }

        $('body').on('click', '.add-location-btn', function(event) {
            event.preventDefault();
            console.log('addLocation');
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    $(event.currentTarget).html(position.coords.latitude + ',' + position.coords.longitude);
                },
                function() {
                    alert('Error getting location');
                });
            return false;
        });

        $('body').on('click', '.add-contact-btn', function(event) {
            event.preventDefault();
            console.log('addToContacts');
            if (!navigator.contacts) {
                app.showAlert("Contacts API not supported", "Error");
                return;
            }
            var contact = navigator.contacts.create();
            contact.name = {givenName: 'Virgo', familyName: 'Systems'};
            var phoneNumbers = [];
            phoneNumbers[0] = new ContactField('work', '+3612345678', false);
            phoneNumbers[1] = new ContactField('mobile', '+36301324567', true); // preferred number
            contact.phoneNumbers = phoneNumbers;
            contact.save();
            return false;
        });

        $('body').on('click', '.change-pic-btn', function(event) {
            event.preventDefault();
            if (!navigator.camera) {
                app.showAlert("Camera API not supported", "Error");
                return;
            }
            var options =   {   quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                encodingType: 0     // 0=JPG 1=PNG
            };

            navigator.camera.getPicture(
                function(imageData) {
                    $('.img').attr('src', "data:image/jpeg;base64," + imageData);
                },
                function() {
                    app.showAlert('Error taking picture', 'Error');
                },
                options);

            return false;
        });
    }
};
