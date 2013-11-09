game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
  	me.levelDirector.loadLevel('testmap');
		game.data.score = 0;
		game.HUD = new game.HUD.Container();
		me.game.world.addChild(game.HUD);
	},

	onDestroyEvent: function() {
		me.game.world.removeChild(game.HUD);
	}
});
