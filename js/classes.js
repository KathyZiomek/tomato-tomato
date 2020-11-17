/*
Create a set of classes
*/
// base class called "TimeSegment"
class TimeSegment {
    //define the constructor function for Device
    constructor(type, minutes/*, seconds*/) {
        this._type = type;                  //String
        this._minutes = minutes;            //Integer
        //this._seconds = seconds;
    }
    
    //create methods
    //getters and setters
    //type    
    get type() {
        return this._type;
    }

    set type(newType) {
        if (newType) {
            this._type = newType;
        }
    }    

    //minutes
    get minutes() {
        return this._minutes;
    }

    set minutes(newMinutes) {
        if (newMinutes) {
            this._minutes = newMinutes;
        }
    }
    
    /*
    //seconds
    get seconds() {
        return this._seconds;
    }

    set seconds(newSeconds) {
        if (newSeconds) {
            this._seconds = newSeconds;
        }
    }
    */

    //create methods to convert minutes to seconds and back

    //minutes to seconds
    //uses the parameter from the user
    minsToSeconds() {
        return parseInt(this._minutes * 60);
    }

    //seconds to minutes
    secondsToMins(userSeconds) {
        return parseInt(userSeconds / 60);
    }

    //seconds to minutes - modulus
    secondsToMinsMod(userSeconds) {
        return parseInt(userSeconds % 60);
    }
}