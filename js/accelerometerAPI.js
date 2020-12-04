//create a function that will be called if a user selects strict mode
function enableStrictMode() {
    //check to see if the device supports the DeviceMotionEvent and DeviceOrientationEvent APIs
    if (!!window.DeviceMotionEvent) {
        window.addEventListener("devicemotion",handleMotion,true);
        self.supported = true;
    }
}

function handleMotion(event) {
    //create empty object to hold the variables we create below
    acceleration = accelerationIncludingGravity = rotationRate = {};

    //Acceleration along axis
    acceleration.x = event.acceleration.x;
    acceleration.y = event.acceleration.y;
    acceleration.z = event.acceleration.z;

    //acceleration along axis which also compensates for the influence of gravity
    accelerationIncludingGravity.x = event.accelerationIncludingGravity.x;
    accelerationIncludingGravity.y = event.accelerationIncludingGravity.y;    accelerationIncludingGravity.z = event.accelerationIncludingGravity.z;

    //The rate of rotation along the axis
    rotationRate.alpha = event.rotationRate.alpha;
    rotationRate.beta = event.rotationRate.beta;
    rotationRate.gamma = event.rotationRate.gamma;

    //returns the interval/time that the event was obtained from the hardware
    interval = event.interval;

    //only output the alerts to the user if they have selected to use strict mode, and it is a study session
    if (useStrict === true) {
        if (accelerationIncludingGravity.x >= 0.5 || accelerationIncludingGravity.x <= -0.5) {
            alert(strictModeAlert);
        }
        else if ((accelerationIncludingGravity.y >= 0.5 || accelerationIncludingGravity.y <= -0.5) && accelerationIncludingGravity.y !== 9.8) {
            //the number 9.8 has to be hardcoded because it seems to be the default value in the Android Emulator
            alert(strictModeAlert);
        }
        else if (accelerationIncludingGravity.z >= 0.5 || accelerationIncludingGravity.z <= -0.5) {
            alert(strictModeAlert);
        }
        else if (rotationRate.alpha >= 0.5 || rotationRate.alpha <= -0.5) {
            alert(strictModeAlert);
        }
        else if (rotationRate.beta >= 0.5 || rotationRate.beta <= -0.5) {
            alert(strictModeAlert);
        }
        else if (rotationRate.gamma >= 0.5 || rotationRate.gamma <= -0.5) {
            alert(strictModeAlert);
        }
    }

    //uncomment for testing purposes    
    //$gel("accelerometerAPI").innerHTML = "<p>" + JSON.stringify(accelerationIncludingGravity) +"</p>";
}

//create a constant that will output when the user uses their phone during a study session
const strictModeAlert = "You can't use your phone during strict mode. \nWait until your next break!";