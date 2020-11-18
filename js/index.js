document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //add an event listener to the button to select the study and break times
    var chooseStudyOptionsButton = document.getElementById("choose-study-options");
    chooseStudyOptionsButton.addEventListener("click", chooseStudyOptions, false);
}

//create a variable to store the study and break times entered
var studyTime = 0;
var breakTime = 0;

//create the function that handles the user entering in the study and break times
function chooseStudyOptions() {
    navigator.notification.prompt(
        "How long do you want your study sessions to be? (in minutes)",       //message
        studyPrompt,                       //callback to invoke
        "Choose Your Study Time",       //title
        ["Submit", "Cancel"],           //buttonLabels
        "25"                            //defaultText
    );
}

//create the function that processes the study results
function studyPrompt(results) {
    if(results.buttonIndex === 1) {
        studyTime = parseInt(results.input1);
        //call the chooseBreakOptions function
        chooseBreakOptions();
    }
    else {
        //tell the user they cancelled
        alert("Studying cancelled.")
    }
} 

//create the function that handles the user entering in break times
function chooseBreakOptions() {
    navigator.notification.prompt(
        "How long do you want your break sessions to be? (in minutes)",       //message
        breakPrompt,                    //callback to invoke
        "Choose Your Break Time",       //title
        ["Submit", "Cancel"],           //buttonLabels
        "5"                             //defaultText
    );
}

//create the function that processes the break results
function breakPrompt(results) {
    if(results.buttonIndex === 1) {
        breakTime = parseInt(results.input1);
        //call the confirmOptions function
        confirmOptions();
    }
    else {
        //tell the user they cancelled
        alert("Studying cancelled.")
    }
} 

//create the function that tells the user what they selected, and starts the timer
function confirmOptions() {
    navigator.notification.confirm(
        studyTime + " minutes for studying, and " + breakTime + " minutes for breaks",       //message
        startTimer,                        //callback to invoke
        "You selected",                    //title
        ["Start Studying", "Cancel"],      //buttonLabels
    );
}

function startTimer(buttonIndex) {
    if(buttonIndex === 1) {
        alert("Studying time begins");
        console.log("it worked");
        //call the createTimes function to create the time objects and begin the timer
        createTimes();
    }
    else {
        //tell the user they cancelled
        alert("Studying cancelled.")
    }
}