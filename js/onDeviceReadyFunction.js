//add an event listener for some functions
//note: most other functions are called through events
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //call the useMedia function to set up the music that will play when a user is studying
    useMedia();

    //call the firebaseApp which will set up the connection to the Firebase database
    firebaseApp();
}