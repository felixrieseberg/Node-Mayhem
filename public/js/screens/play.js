/* global audioManager */

// Play screen
/* ----------------------------------------------------------------- */
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function () {
        // load the level
        me.levelDirector.loadLevel('middleearth');

        // reset the score
        game.data.score = 0;

        // add our HUD to the game world
        game.HUD = new game.HUD.Container();
        me.game.world.addChild(game.HUD);
        game.gameReady();
        audioManager.init();
    },

    onDestroyEvent: function () {
        // remove the HUD from the game world
        me.game.world.removeChild(game.HUD);
    }
});
