//create several variables that will hold information related to the timer data and will be used for calculations and displaying information to the user
var timeLeft = 0;       //decrements and is used to calculate the timer that is output to the screen
var totalTime = 0;      //is generated at the beginning of the timer segment, and is used to generate the progress bar
var currentSegment;     //is the variable that stores the iterator, and is used to iterate through the objects
var timer;              //is the variable that stores the setTimeout function that counts down the time and outputs the time to the user

//create a variable to store the total time studied
//this variable will be used to store the total time studied within the Firebase database
var totalTimeStudied = 0;

//create an empty array to contain the time objects
var TimeSegments = [];

//create an iterator
var iterator;

//onload, generate the data for the TimeSegments array
function createTimes() {
    //check to see if there is already data in the array (i.e. the timer has already run once before)
    if(TimeSegments.length > 0) {
        TimeSegments.length = 0;
        //re-add the removed classes to the divs
        $gel("timerOutputDiv").classList.add('display-1', 'text-center', 'mt-5', 'pt-5');
        $gel("progressBarDiv").classList.add('progress', 'mt-3', 'mb-3');
        $gel("mainPage").classList.add('text-center');
        //empty the output div
        $gel("resultsOutputDiv").innerHTML = "";
    }
    //create three Pomodoro cycles
    //future versions of the app can have the number of Pomodoro cycles be selected by the user
    for (var i = 1; i <= 6; i++) {
        if (i % 2 === 1) {
            TimeSegments.push(new TimeSegment("Study Session", studyTime));
        }
        else if (i % 2 === 0) {
            TimeSegments.push(new TimeSegment("Break", breakTime)); 
        }
    }
    //uncomment to test the data, and see the class information
    //console.log(TimeSegments);

    //get the amount of time studied
    for (var i = 0; i < TimeSegments.length; i++) {
        if (TimeSegments[i].type == "Study Session") {
            totalTimeStudied += parseInt(TimeSegments[i].minutes);
        }
    }

    //create an iterator variable using TimeSegments.iterator
    iterator = TimeSegments[Symbol.iterator]();

    //save the amount of time it will be to the Firebase database
    saveTimeStudiedWithFirebase();
    //save the amount of time studied to the local database
    //ideally, this value would also take into account whether the user skips the timer during a study session, which could be implemented in the future
    saveToDBStorage();
    //call the handleTimer function
    handleTimer();
}

//create a function that will be triggered when the "Start Studying" button is clicked
function handleTimer() {

    //get the media API to play music while the timer is running
    //ideally, this timer would only play music during a study session, or a user could opt to listen to music or not - that can be implemented in the future
    media.play();

    //identify the first time segment using the iterator
    currentSegment = iterator.next();
    timeLeft = currentSegment.value.minsToSeconds();
    totalTime = currentSegment.value.minsToSeconds();

    //empty the page contents
    $gel("mainPage").innerHTML = "";
    //call the decreaseSeconds function through the arrayHelper
    arrayHelper();

    //empty the button div
    $gel("buttons").innerHTML = "";
    //create a skip button
    var skipButton = document.createElement("button");
    skipButton.innerText = "Skip";
    skipButton.type = "submit";
    skipButton.setAttribute("onclick", "skipTimer();");
    skipButton.setAttribute("class", "btn btn-danger mt-4 pr-4 pl-4");
    //append the skip button to the page
    $gel("buttons").appendChild(skipButton);

    //unhide the progress bar
    $gel("progressBarDiv").classList.remove("hiddenClass");
    $gel("progressBarID").classList.remove("hiddenClass");
    //set the max value on the progress bar
    $gel("progressBarID").setAttribute("aria-valuemax", totalTime);
}

/*
create a function that:
- converts the minutes to seconds
- evaluates which object we are on (i.e. either a study session or a break)
- and increases the array counter
*/
function arrayHelper() {
    //figure out which time segment the timer is on
    //if the time has run out, use the iterator to go to the next time segment
    if (timeLeft === 0) {
        currentSegment = iterator.next();

        if (currentSegment.done === true) {
            //uncomment for testing
            //console.log("iterator is done");
            
            //hide the progress bar
            $gel("progressBarID").classList.add("hiddenClass");
            $gel("progressBarDiv").classList.add("hiddenClass");
            
            //Tell the user that the timer is done
            $gel("timerOutputDiv").innerHTML = "Done!";
            //empty the button div
            $gel("buttons").innerHTML = "";
            //create a button that will take the user to the results page
            var goToResultsButton = document.createElement("button");
            goToResultsButton.innerText = "See Your Statistics";
            goToResultsButton.type = "submit";
            goToResultsButton.setAttribute("onclick", "seeStatistics();");
            goToResultsButton.setAttribute("class", "btn btn-danger mt-4");
            //append the button to the page
            $gel("buttons").appendChild(goToResultsButton);
        }
        else if (currentSegment.done !== true) {
            //check if the user has opted to use strict mode
            if (strictModeEnabled === true) {
                //check if it is a study or break time to enable or disable strict mode
                if (currentSegment.value.type == "Study Session") {
                    //study session: enable strict mode
                    useStrict = true;
                }
                else if (currentSegment.value.type == "Break") {
                    //break: disable strict mode
                    useStrict = false;
                }
            }

            //take the values from the object (minutes input by the user) and convert the values to seconds
            totalTime = currentSegment.value.minsToSeconds();       //used by the progress bar
            timeLeft = currentSegment.value.minsToSeconds();        //used to output the timer on the screen

            //set the min and max values for the progress bar
            $gel("progressBarID").setAttribute("aria-valuemin", 0);
            $gel("progressBarID").setAttribute("aria-valuemax", totalTime);

            //clear the timer
            stopTimer();
            //re-run the function with the new timeLeft value
            arrayHelper();
        }
    }
    else if (timeLeft !== 0) {
        //decrease the seconds
        timeLeft--;
        
        //get the minutes
        let mins = currentSegment.value.secondsToMins(timeLeft);
        //format the minutes and seconds before outputting to the screen
        if (mins < 10) {
            mins = "0" + mins;
        }
        //get the seconds
        let secs = currentSegment.value.secondsToMinsMod(timeLeft);
        //format
        if (secs < 10) {
            secs = "0" + secs;
        }

        //update the values in the progress bar
        $gel("progressBarID").setAttribute("aria-valuenow", (totalTime-timeLeft));
        $gel("progressBarID").setAttribute("style", "width:"+((totalTime-timeLeft)/totalTime)*100+"%;");
        
        //output in a formatted way (minutes:seconds)
        //output using TimeSegments methods
        $gel("timerOutputDiv").innerHTML = mins + ":" + secs;
        //update the page title with the time
        document.title = mins + ":" + secs;

        //call the function with setTimeout
        timer = setTimeout(function(){arrayHelper()}, 1000);        
    }
}
