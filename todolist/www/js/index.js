var app = {
    rowId: 0,
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.getElementById('create-new').addEventListener('click', app.createNewToDo, false);
        document.getElementById('remove-completed').addEventListener('click', app.removeCompletedTasks, false);
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
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);

        // create the checkbox
        var cell1 = row.insertCell(0);
        var element1 = document.createElement("input");
        element1.type = "checkbox";
        element1.name = "chkbox[]";
        element1.checked = todoDictionary["check"];
        element1.setAttribute("onclick", "app.checkboxClicked()");
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
        element3.setAttribute("onclick", "app.viewSelectedRow(document.getElementById('text' + this.id).value)");
        cell3.appendChild(element3);

        // create the delete button
        var cell4 = row.insertCell(3);
        var element4 = document.createElement("input");
        element4.type = "button";
        element4.value = "Delete";
        element4.setAttribute("onclick", "app.deleteSelectedRow(this)");
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
        var table = document.getElementById("data-table");
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

        var table = document.getElementById("data-table");
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
    },
    loadToDoList: function() {
        var theList = JSON.parse(window.localStorage.getItem("todoList"));

        if (null == theList || theList == "null") {
            app.deleteAllRows();
        } else {
            var count = 0;
            for (var obj in theList) {
                count++;
            }

            // remove any existing rows from the table
            app.deleteAllRows();

            // loop through the to-dos
            for(var i = 0; i < count; i++) {
                // adding a row to the table for each one
                app.addTableRow(theList["row" + i], true);
            }
        }
    },
    deleteAllRows: function() {
        var table = document.getElementById("data-table");
        var rowCount = table.rows.length;

        // loop through all rows of the table
        for(var i = 0; i < rowCount; i++) {
            // delete the row
            table.deleteRow(i);
            rowCount--;
            i--;
        }

        // save the to-do list
        app.saveToDoList();
    }

};
