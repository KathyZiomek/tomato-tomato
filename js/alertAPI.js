//create a variable to store the study and break times entered
var studyTime = 0;
var breakTime = 0;
//create a variable that will store if strict mode has been enabled or not
var strictModeEnabled = false;
//create a variable that will change if strict mode has been enabled
var useStrict = false;

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
        //call the strictMode function
        strictMode();
    }
    else {
        //tell the user they cancelled
        alert("Studying cancelled.")
    }
} 


//create a function that enables "strict mode" and is connected to the accelerometer function
function strictMode() {
    navigator.notification.confirm(
        "Strict Mode sends you reminders if you are trying to use your phone while the study session is active.",       //message
        strictModeResults,                    //callback to invoke
        "Enable strict mode?",       //title
        ["Yes", "No"],           //buttonLabels
    );
}

//create the function that processes the break results
function strictModeResults(buttonIndex) {
    if(buttonIndex === 1) {
        //enable the strict mode variables
        strictModeEnabled = true;
        useStrict = true;
        //call the function that enables watching the phone's movement
        enableStrictMode();
        //call the confirmOptions function 
        confirmOptions();
    }
    else {
        //strict mode stays disabled
        strictModeEnabled = false;
        useStrict = false;

        //call the confirmOptions function 
        confirmOptions();
    }
}

//create the function that tells the user what they selected, and starts the timer
function confirmOptions() {
    navigator.notification.confirm(
        studyTime + " minutes for studying, and " + breakTime + " minutes for breaks",       //message
        startTimer,                        //callback to invoke
        "You selected:",                    //title
        ["Start Studying", "Cancel"],      //buttonLabels
    );
}

function startTimer(buttonIndex) {
    if(buttonIndex === 1) {
        //call the createTimes function to create the time objects and begin the timer
        createTimes();
    }
    else {
        //tell the user they cancelled
        alert("Selection cancelled.")
    }
}