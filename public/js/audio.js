var audioManager = Object.extend({
    init: function () {
        // initialize the "sound engine", giving "mp3" and "ogg" as desired audio format 
        // i.e. on Safari, the loader will load all audio.mp3 files, 
        // on Opera the loader will however load audio.ogg files

        //me.audio.init('ogg');
        console.log("Audio manager init");


    },
    playBackgroundMusic: function (enabled) {
        console.log("Playing background music");
        // Playing background music as defined in resources.js
        if (enabled) {
            me.audio.playTrack("backgroundmusic1");
        } else if (enabled === false) {
            me.audio.pauseTrack();
        } else {
            me.audio.playTrack("backgroundmusic1");
        }
    }
});