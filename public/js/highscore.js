(function () {
    highscoreManager = {
        init: function () {
            // initialize the "sound engine", giving "mp3" and "ogg" as desired audio format 
            // i.e. on Safari, the loader will load all audio.mp3 files, 
            // on Opera the loader will however load audio.ogg files

            //me.audio.init('ogg');
            highscoreManager.score = document.getElementById("individualScores");
        },

        addPlayer: function (username, points) {
            var newElement = document.createElement("li");
            newElement.textContent(username + ": " + points);
            newElement.setAttribute("id", "individualScore-" + username);
        },

        updatePlayer: function (username, points) {
            var updateElement = document.getElementById("individualScore-" + username);
            newElement.textContent(username + ": " + points);
        }
    }
})();
