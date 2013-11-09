var game = {
  data: {
      score: 0
  },

  'onload': function () {
      me.sys.pauseOnBlur = false;
      if (!me.video.init('screen', 1200, 800, true, 'auto')) {
          alert('Your browser does not support HTML5 canvas.');
          return;
      }
      // add '#debug' to the URL to enable the debug Panel
      if (document.location.hash === '#debug') {
          window.onReady(function () {
              me.plugin.register.defer(debugPanel, 'debug');
          });
      }

      me.audio.init('mp3,ogg');
      me.loader.onload = this.loaded.bind(this);
      me.loader.preload(game.resources);
      me.state.change(me.state.LOADING);
  },

  'loaded': function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.debug.renderHitBox = true;
    me.entityPool.add('mainPlayer', game.PlayerEntity);
    me.entityPool.add('bullet', game.BulletEntity, true);

    me.input.bindKey(me.input.KEY.SPACE, 'shoot');
    me.input.bindMouse(0, me.input.KEY.SPACE);
    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.UP, 'up');
    me.input.bindKey(me.input.KEY.W, 'up');
    me.input.bindKey(me.input.KEY.DOWN, 'down');
    me.input.bindKey(me.input.KEY.S, 'down');

    me.state.change(me.state.PLAY);

    game.mp = new Multiplayer(function (x, y) {
      var obj = me.entityPool.newInstanceOf('mainPlayer', x, y, {
        spritewidth: 48,
        spriteheight: 48,
        isMP: true
      });
      me.game.add(obj, 1);
      me.game.sort(); return obj;
    });
  }
};
