//create a global variable for media
var media;

function useMedia() {
    var sourceToPlay;
    if(device.platform === 'Android') {
        sourceToPlay = '/android_asset/www/2019-06-12_-_Homework_-_David_Fesliyan.mp3';
    }else {
        sourceToPlay = '2019-06-12_-_Homework_-_David_Fesliyan.mp3';
    }

    media = new Media( sourceToPlay, null, mediaError);

    function mediaError(error) {
        $gel("mediaOutput").innerHTML = "There was a problem. Error code " + error.code;
    }

     function stopMedia() {
        media.stop();
    }

    //media.play();
}
