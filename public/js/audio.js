(function () {
    audioManager = {
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
                me.audio.playTrack("backgroundmusic1", .5 * game.data.volume);
            } else if (enabled === false) {
                me.audio.stopTrack();
            } else {
                me.audio.playTrack("backgroundmusic1", .5 * game.data.volume);
            }
        },

        switchMusic: function () {
            if (me.audio.getCurrentTrack() != null) {
                audioManager.playBackgroundMusic(false);
                document.getElementById("musicSwitch").textContent = "ENABLE MUSIC";
            } else {
                audioManager.playBackgroundMusic(true);
                document.getElementById("musicSwitch").textContent = "DISABLE MUSIC";
            }
        },

        switchMute: function () {
            if (me.audio.isAudioEnable()) {
                console.log("Muting!");
                me.audio.disable();
                document.getElementById("soundSwitch").textContent = "ENABLE ALL SOUNDS";
            } else {
                console.log("Unmuting!");
                me.audio.enable();
                document.getElementById("soundSwitch").textContent = "DISABLE ALL SOUNDS";
            }
        },

        playSound: function (effect) {
            // shoot, death, powerup, hit, explosion
            switch (effect) {
                case "shoot":
                    me.audio.play("shoot", false, null, game.data.volume);
                    break;
                case "death":
                    me.audio.play("death", false, null, game.data.volume);
                    break;
                case "powerup":
                    me.audio.play("powerup", false, null, game.data.volume);
                    break;
                case "hit":
                    me.audio.play("hit", false, null, game.data.volume);
                    break;
                case "explosion":
                    me.audio.play("explosion", false, null, game.data.volume);
                    break;
                default:
                    break;
            }
        }
    }
})();
