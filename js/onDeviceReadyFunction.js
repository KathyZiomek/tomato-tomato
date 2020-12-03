document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    useMedia();

    //add an event listener to the button to select the study and break times
    var chooseStudyOptionsButton = $gel("choose-study-options");
    chooseStudyOptionsButton.addEventListener("click", chooseStudyOptions, false);

    firebaseApp();

}