//create a variable that will store the time data
var timeLeft = 0;
var currentSegment;
var timer;
//create an empty array to contain the time objects
var TimeSegments = [];

//onload, generate the data for the TimeSegments array
function createTimes() {
    //create three Pomodoro cycles
    for (var i = 1; i <= 6; i++) {
        if (i % 2 === 1) {
            TimeSegments.push(new TimeSegment("Study Session", 25));
        }
        else if (i % 2 === 0) {
            TimeSegments.push(new TimeSegment("Break", 5)); 
        }
    }
    //test the data
    console.log(TimeSegments);
}

//create an iterator variable using TimeSegments.iterator
var iterator = TimeSegments[Symbol.iterator]();

//using alert API, update the TimeSegments objects


//create a function that will be invoked when the submit button submits the user study length
function submitTime() {
    //create a new button to start the countdown
    var startButton = document.createElement("button");
    startButton.innerText = "Start Studying";
    startButton.type = "submit";
    //connect the button to another function that starts the countdown
    startButton.setAttribute("onclick", "handleTimer();");
    //output the button to the webpage
    $gel("buttons").appendChild(startButton);
}

//create a function that will be triggered when the "Start Studying" button is clicked
function handleTimer() {
    //identify the first time segment using the iterator
    currentSegment = iterator.next();
    console.log(currentSegment);
    timeLeft = currentSegment.value.minsToSeconds();
    console.log(timeLeft);

    //empty the page contents
    $gel("userForm").innerHTML = "";
    $gel("buttons").innerHTML = "";
    //call the decreaseSeconds function through the arrayHelper
    arrayHelper();

    //create a stop button
    var stopButton = document.createElement("button");
    stopButton.innerText = "Stop";
    stopButton.type = "submit";
    stopButton.setAttribute("onclick", "stopTimer();");
    $gel("buttons").appendChild(stopButton);

    //create a skip button
    var skipButton = document.createElement("button");
    skipButton.innerText = "Skip";
    skipButton.type = "submit";
    skipButton.setAttribute("onclick", "skipTimer();");
    $gel("buttons").appendChild(skipButton);
}

/*
create a helper function that:
- converts the minutes to seconds
- evaluates which item of the array we're on
- and increases the array counter
*/

function arrayHelper() {
    //figure out which time segment the timer is on
    //if the time has run out, use the iterator to go to the next time segment
    if (timeLeft === 0) {
        currentSegment = iterator.next();

        if (currentSegment.done === true) {
            console.log("iterator is done");
            //clear the div
            $gel("timerOutput").innerHTML = "";
            //clear the buttons
            $gel("buttons").innerHTML = "";
        }
        else if (currentSegment.done !== true) {
            console.log(currentSegment);
            timeLeft = currentSegment.value.minsToSeconds();
            console.log(timeLeft);
            
            //clear the timer
            stopTimer();
            //re-run the function with the new timeLeft value
            arrayHelper();
        }
    }
    else if (timeLeft !== 0) {
        //decrease the seconds
        timeLeft--;
        console.log(timeLeft);
        //get the minutes
        let mins = currentSegment.value.secondsToMins(timeLeft);
        //format
        if (mins < 10) {
            mins = "0" + mins;
        }
        //get the seconds
        let secs = currentSegment.value.secondsToMinsMod(timeLeft);
        //format
        if (secs < 10) {
            secs = "0" + secs;
        }
        
        //output in a formatted way (minutes:seconds)
        //output using TimeSegments methods
        $gel("timerOutput").innerHTML = mins + ":" + secs;
        //update the page title with the time
        document.title = mins + ":" + secs;

        //call the function with setTimeout
        timer = setTimeout(function(){arrayHelper()}, 1000);        
    }
}
