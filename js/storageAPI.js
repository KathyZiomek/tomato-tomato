//a function that will be called once the timer concludes, and the user selects the button to see their statistics
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

//a function that will save the information to the local database - is called when the user first enters their timer information
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
    //uncomment if the local database needs to be erased for testing purposes
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE Reports',
            null,
            null,
            function(tx,error) {
                console.error("Error: " + error.message);
                }
        );
    });
    */
    
    db.transaction(function (tx) {
        //create the table
        tx.executeSql('CREATE TABLE IF NOT EXISTS Reports (username, date, studyTime)',
            null,
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        );
        //insert values to the table
        tx.executeSql('INSERT INTO Reports (username, date, studyTime) VALUES (?, ?, ?)',
            [username, date, studyTime],
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        );
    });
}

//output the information from the local database - is called when the user selects the button to output their statistics
function outputDatabaseInfo() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT date, studyTime FROM Reports', [], function (tx, results) {
            //get the number of rows in the database
            var len = results.rows.length, i;
            //verify if data has been found in the database
            if (len > 0) {
                //clear the formatting for the other divs so the table outputs nicely
                $gel("timerOutputDiv").removeAttribute('class');
                $gel("progressBarDiv").removeAttribute('class');
                $gel("mainPage").removeAttribute('class');

                //output the user's username with a message
                $gel("resultsOutputDiv").innerHTML += "<h3 class='text-danger mt-2'>Results for " + username + ":</h3><br><br>";

                //uncomment if needed for testing
                //console.log(len + " rows found");

                //create a dynamically generated table with the local database information
                //get the location for the table
                var tableOutputDiv = $gel("resultsOutputDiv");

                //create a columns array
                var columnsTitles = ["Entry", "Date", "Time Spent Studying"];   //used for the table headings
                var columnsData = ["date", "studyTime"];                        //used for retrieving information from the database

                //create the table element
                var table = document.createElement("table");
                //set attributes for the table
                table.setAttribute("class", "table text-center outputTable");

                //create the heading row
                var headings = document.createElement("tr");
                //loop through the columns array to create the two heading columns
                for (var i = 0; i < columnsTitles.length; i++) {
                    //create the heading title
                    var column = document.createElement("th");
                    column.setAttribute("scope", "col");
                    var columnText = document.createTextNode(columnsTitles[i]);
                    column.appendChild(columnText);
                    //append the heading to the table row
                    headings.appendChild(column);
                }
                //append the first row to the table
                table.appendChild(headings);

                //loop through the rows retrieved from the database and create additional table rows
                for (var i = 0; i < len; i++) {
                    //create the new row
                    var newRow = document.createElement("tr");

                    //create an ID variable that will identify the row number
                    var ID = document.createElement("th");
                    ID.setAttribute("scope", "row");
                    var IDText = document.createTextNode('#' + (i + 1));
                    //append to the cell
                    ID.appendChild(IDText);
                    //append to the row
                    newRow.appendChild(ID);

                    //loop through the results from the specific row from the database
                    for (var j = 0; j < columnsData.length; j++) {
                        //create the new element
                        var tableData = document.createElement("td");
                        //identify which value we are retrieving from the database
                        if (columnsData[j] == "date") {
                            var tableDataText = document.createTextNode(results.rows.item(i).date);
                        }
                        else if (columnsData[j] == "studyTime") {
                            var tableDataText = document.createTextNode(results.rows.item(i).studyTime);
                        }
                        //append the text to the cell
                        tableData.appendChild(tableDataText);
                        //append the cell to the row
                        newRow.appendChild(tableData);
                    }
                    //append the row to the table
                    table.appendChild(newRow);
                }

                //append the entire table to the output div
                tableOutputDiv.appendChild(table)

                //create a button that will allow the user to input their studying information again to repeat the loop
                var keepStudyingButton = document.createElement("button");
                keepStudyingButton.innerText = "Keep Studying";
                keepStudyingButton.type = "submit";
                keepStudyingButton.setAttribute("onclick", "chooseStudyOptions();");
                keepStudyingButton.setAttribute("class", "btn btn-danger mt-4");
                //append the button to the div
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
        },
        function(tx,error) {
            console.error("Error: " + error.message);
        });
    });
}