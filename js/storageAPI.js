function seeStatistics() {
    //stop the music that is playing
    media.stop();
    //empty the timer output div
    $gel("timerOutputDiv").innerHTML = "";
    //empty the button div
    $gel("buttons").innerHTML = "";

    //output the information in the database
    outputDatabaseInfo();

}

//create a variable for the database
var db;
//create global variables for the username and studyTime
var username, studyTime;

function saveToDBStorage() {
    db = window.openDatabase("myExampleDB", "1.0", "ExampleDB", 2 * 1024 * 1024);

    //create a date variable
    var tempDate = new Date();
    var date = (tempDate.getMonth() + 1) + "/" + (tempDate.getDate()) + "/" + (tempDate.getFullYear());
    //get the username
    returnUsernameFromFirebase();
    //get the study time from the database
    returnStudyTimeFromFirebase();

    /*
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE Reports',
            null,
            null,
            function(tx,error) {
                console.error("Error: " + error.message);
                }
        );
    });*/
    

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Reports (username, date, studyTime)',
            null,
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        );
        tx.executeSql('INSERT INTO Reports (username, date, studyTime) VALUES (?, ?, ?)',
            [username, date, studyTime],
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        );
    });
}

function outputDatabaseInfo() {
    db.transaction(function (tx) {
        /*KEEP: 
        tx.executeSql('SELECT date, studyTime FROM Reports WHERE username= ?', [ username ], */
        //
        //tx.executeSql('SELECT date, studyTime FROM Reports WHERE username= ?', [ username ], 
        //tx.executeSql('SELECT * FROM Reports', [],
        /*
        tx.executeSql('SELECT SUM(studyTime) AS test FROM Reports WHERE username=? GROUP BY(date)', [username], function (tx, results) {
            */
           //        tx.executeSql('SELECT SUM(CAST (studyTime AS INT)) AS test FROM Reports WHERE username=? GROUP BY(date)', [username],
           tx.executeSql('SELECT date, studyTime FROM Reports', [], function (tx, results) {
                //var data = "";
                var len = results.rows.length, i;
                //verify if data has been found in the database
                if (len > 0) {
                    //clear the formatting for the other divs
                    $gel("timerOutputDiv").removeAttribute('class');
                    $gel("progressBarDiv").removeAttribute('class');
                    $gel("mainPage").removeAttribute('class');

                    //output the user's username with a message
                    $gel("resultsOutputDiv").innerHTML += "<h3 class='text-danger mt-2'>Results for " + username + ":</h3><br><br>";

                    console.log(len + " rows found");

                    //create a table

                    //get the location for the table
                    var tableOutputDiv = $gel("resultsOutputDiv");

                    //create a columns array
                    var columnsTitles = ["Entry", "Date", "Time Spent Studying"];
                    var columnsData = ["date", "studyTime"];

                    //create a dynamically generated table that will update based on the entries in the database
                    var table = document.createElement("table");
                    //set attributes for the table
                    table.setAttribute("class", "table text-center outputTable");

                    //create the heading row
                    var headings = document.createElement("tr");
                    //loop through the columns array to create the two heading columns
                    for (var i = 0; i < columnsTitles.length; i++) {
                        var column = document.createElement("th");
                        column.setAttribute("scope", "col");
                        var columnText = document.createTextNode(columnsTitles[i]);
                        column.appendChild(columnText);
                        headings.appendChild(column);
                    }
                    //append the first row to the table
                    table.appendChild(headings);

                    //loop through the results and create additional table rows
                    for (var i = 0; i < len; i++) {
                        var newRow = document.createElement("tr");

                        var ID = document.createElement("th");
                        ID.setAttribute("scope", "row");
                        var IDText = document.createTextNode('#' + (i + 1));
                        //append to the cell
                        ID.appendChild(IDText);
                        //append to the row
                        newRow.appendChild(ID);

                        //loop through the results from the database
                        for (var j = 0; j < columnsData.length; j++) {
                            var tableData = document.createElement("td");
                            if (columnsData[j] == "date") {
                                var tableDataText = document.createTextNode(results.rows.item(i).date);
                            }
                            else if (columnsData[j] == "studyTime") {
                                var tableDataText = document.createTextNode(results.rows.item(i).studyTime);
                            }
                            tableData.appendChild(tableDataText);
                            //append to the row
                            newRow.appendChild(tableData);
                        }
                        //append the row to the table
                        table.appendChild(newRow);
                    }

                    //append the data to the output div
                    tableOutputDiv.appendChild(table)

                    //create a button that will allow the user to input their studying information again to repeat the loop
                    var keepStudyingButton = document.createElement("button");
                    keepStudyingButton.innerText = "Keep Studying";
                    keepStudyingButton.type = "submit";
                    keepStudyingButton.setAttribute("onclick", "chooseStudyOptions();");
                    keepStudyingButton.setAttribute("class", "btn btn-danger mt-4");
                    tableOutputDiv.appendChild(keepStudyingButton);
                }
                else {
                    $gel("resultsOutputDiv").innerHTML = "No results found.<br><br>Would you like to keep studying?";
                    //create a button that will allow the user to input their studying information again to repeat the loop
                    var keepStudyingButton = document.createElement("button");
                    keepStudyingButton.innerText = "Keep Studying";
                    keepStudyingButton.type = "submit";
                    keepStudyingButton.setAttribute("onclick", "chooseStudyOptions();");
                    keepStudyingButton.setAttribute("class", "btn btn-danger mt-5");
                    tableOutputDiv.appendChild(keepStudyingButton);
                }


                
                /*
                for (i = 0; i < len; i++) {
                    data += 'Entry #' + (i + 1) + "<br>";
                    data += "test: " + results.rows.item(i).test + "<br>";             
                }*/

            //output to the database output div
           //$gel("resultsOutputDiv").innerHTML = "Database Storage:<br><hr>" + data;

        },
        function(tx,error) {
            console.error("Error: " + error.message);
        });
    });
}