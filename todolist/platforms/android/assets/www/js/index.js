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
        app.rowID = 0;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('create-new').addEventListener('click', app.createNewToDo, false);
        document.getElementById('remove-completed').addEventListener('click', app.removeCompletedTasks, false);
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
    createNewToDo: function() {
        console.log('createNewToDo');
        var todoDictionary = {};

        // prompt the user to enter to-do
        var todo = prompt("To-Do","");
        if (todo != null) {
            if (todo == "") {
                alert("To-Do can't be empty!");
            } else {
                // append the new to-do with the table
                todoDictionary = { check : 0 , text : todo};
                app.addTableRow(todoDictionary, false);
            }
        }
    },
    addTableRow: function(todoDictionary, appIsLoading) {
        console.log('addTableRow');
        app.rowID +=1;
        var table = document.getElementById("data-table");
        console.log('FTNTZ');
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);

        // create the checkbox
        var cell1 = row.insertCell(0);
        var element1 = document.createElement("input");
        element1.type = "checkbox";
        element1.name = "chkbox[]";
        element1.checked = todoDictionary["check"];
        element1.setAttribute("onclick", "checkboxClicked()");
        cell1.appendChild(element1);

        // create the textbox
        var cell2 = row.insertCell(1);
        var element2 = document.createElement("input");
        element2.type = "text";
        element2.name = "txtbox[]";
        element2.size = 16;
        element2.id = "text" + app.rowID;
        element2.value = todoDictionary["text"];
        element2.setAttribute("onchange", "saveToDoList()");
        cell2.appendChild(element2);

        // create the view button
        var cell3 = row.insertCell(2);
        var element3 = document.createElement("input");
        element3.type = "button";
        element3.id = app.rowID;
        element3.value = "View";
        element3.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");
        cell3.appendChild(element3);

        // create the delete button
        var cell4 = row.insertCell(3);
        var element4 = document.createElement("input");
        element4.type = "button";
        element4.value = "Delete";
        element4.setAttribute("onclick", "deleteSelectedRow(this)");
        cell4.appendChild(element4);

        // update the UI and save the to-do list
        app.checkboxClicked();
        app.saveToDoList();

        if (!appIsLoading) alert("Task Added Successfully.");
    },
    checkboxClicked: function() {
        console.log('checkboxclicked');
        var table = document.getElementById("data-table");
        var rowCount = table.rows.length;

        // loop through all rows of the table
        for(var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0];
            var textbox = row.cells[1].childNodes[0];

            // if the checkbox is checked, add the strike-through styling
            if(null != chkbox && true == chkbox.checked) {
                if(null != textbox) {
                    textbox.style.setProperty("text-decoration", "line-through");
                }
            }
            // if the checkbox isn't checked, remove the strike-through styling
            else {
                textbox.style.setProperty("text-decoration", "none");
            }
        }
        // save the to-do list
        app.saveToDoList();
    },
    removeCompletedTasks: function() {
        var table = document.getElementById("dataTable");
        var rowCount = table.rows.length;

        // loop through all rows of the table
        for(var i = 0; i < rowCount; i++) {
            // if the checkbox is checked, delete the row
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0];
            if(null != chkbox && true == chkbox.checked) {
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
        // save the to-do list
        app.saveToDoList();
        alert("Completed Tasks Were Removed Successfully.");
    },
    saveToDoList: function() {
        console.log('saveToDoList');
        var todoArray = {};
        var checkBoxState = 0;
        var textValue = "";

        var table = document.getElementById("dataTable");
        var rowCount = table.rows.length;

        if (rowCount != 0) {
            // loop through all rows of the table
            for(var i=0; i<rowCount; i++) {
                var row = table.rows[i];

                // determine the state of the checkbox
                var chkbox = row.cells[0].childNodes[0];
                if(null != chkbox && true == chkbox.checked) {
                    checkBoxState = 1;
                } else {
                    checkBoxState= 0;
                }

                // retrieve the content of the to-do
                var textbox = row.cells[1].childNodes[0];
                textValue = textbox.value;

                // populate the array
                todoArray["row" + i] = {
                    check : checkBoxState,
                    text : textValue
                };
            }
        } else {
            todoArray = null;
        }
        // use the local storage API to persist the data as JSON
        window.localStorage.setItem("todoList", JSON.stringify(todoArray));
    },
    viewSelectedRow: function(todoTextField) {
        alert(todoTextField);
    },
    deleteSelectedRow: function(deleteButton) {
        var p = deleteButton.parentNode.parentNode;
        p.parentNode.removeChild(p);
        this.saveToDoList();
    }

};
