//create a helper function that will assist when identifying an element by its ID
//this will save space and repetition in the code
function $gel(id) {
    return document.getElementById(id);
}

//stopTimer function that clears the setTimeout function
function stopTimer() {
    clearTimeout(timer);
}

//skipTimer function that uses the iterator
function skipTimer() {
    //reset timeLeft to 0 seconds
    timeLeft = 0;
}