// Highscore manager, responsible for displaying and updating
// players' scores
/* ----------------------------------------------------------------- */
(function () {
    var highscoreManager = {
        init: function () {
            highscoreManager.score = document.getElementById('individualScores');
        },

        addPlayer: function (username, points) {
            var newElement = document.createElement('li');
            newElement.textContent(username + ': ' + points);
            newElement.setAttribute('id', 'individualScore-' + username);
        },

        updatePlayer: function (username, points) {
            var updateElement = document.getElementById('individualScore-' + username);
            updateElement.textContent(username + ': ' + points);
        }
    };
})();
