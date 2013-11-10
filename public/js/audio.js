var audioManager = Object.extend({
    init : function () {
        // initialize the "sound engine", giving "mp3" and "ogg" as desired audio format 
        // i.e. on Safari, the loader will load all audio.mp3 files, 
        // on Opera the loader will however load audio.ogg files
        me.audio.init('mp3,ogg');

        me.audio.playTrack("gamemusic");
    }
});