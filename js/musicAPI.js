//create a global variable for media
var media;

function useMedia() {
    var sourceToPlay;
    //select the media file from the folders
    //for project purposes, only one file is included, but if the app was released, it would need to include more music or a link to a stream of music to last the duration of the timers
    if(device.platform === 'Android') {
        sourceToPlay = '/android_asset/www/2019-06-12_-_Homework_-_David_Fesliyan.mp3';
    }else {
        sourceToPlay = '2019-06-12_-_Homework_-_David_Fesliyan.mp3';
    }

    //create the media object
    media = new Media( sourceToPlay, null, mediaError);

    function mediaError(error) {
        $gel("mediaOutput").innerHTML = "There was a problem. Error code " + error.code;
    }
}
