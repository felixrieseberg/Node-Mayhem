
var game = {
  data: {
      score: 0,
      health: 3
  },

  players: {},
  mouseTarget: {},
  gameReady: function() { console.log('default game ready'); },
  MAIN_PLAYER_OBJECT: 4,

  'onload': function () {
      me.sys.pauseOnBlur = false;
      if (!me.video.init('screen', 1200, 600, true)) {
          alert('Your browser does not support HTML5 canvas.');
          return;
      }

      if (document.location.hash === '#debug') {
          window.onReady(function () {
              me.plugin.register.defer(debugPanel, 'debug');
          });
      }
      me.input.registerPointerEvent('mousemove', me.game.viewport, function(e) {
        game.mouseTarget = { x: e.gameWorldX, y: e.gameWorldY };
      });
      me.audio.init('mp3,ogg');
      me.loader.onload = this.loaded.bind(this);
      me.loader.preload(game.resources);
      me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  'loaded': function () {
      me.state.set(me.state.MENU, new game.TitleScreen());
      me.state.set(me.state.PLAY, new game.PlayScreen());

      //Audio
      audioMngr = new audioManager();
      audioMngr.playBackgroundMusic(true);

      // debug
      me.debug.renderHitBox = true;

      // add our player entity in the entity pool
      me.entityPool.add("mainPlayer", game.PlayerEntity);
      me.entityPool.add("enemyPlayer", game.NetworkPlayerEntity);
      me.entityPool.add("bullet", game.BulletEntity, true);
      me.entityPool.add("gun", game.GunEntity, true);
      me.entityPool.add("CrateEntity", game.CrateEntity);
      me.entityPool.add("RockEntity", game.RockEntity);
      // enable the keyboard
      me.input.bindKey(me.input.KEY.SPACE, 'shoot');
      // map the left button click on the X key
      me.input.bindMouse(0, me.input.KEY.SPACE);

      me.input.bindKey(me.input.KEY.LEFT, 'left');
      me.input.bindKey(me.input.KEY.A, 'left');
      me.input.bindKey(me.input.KEY.RIGHT, 'right');
      me.input.bindKey(me.input.KEY.D, 'right');
      me.input.bindKey(me.input.KEY.UP, 'up');
      me.input.bindKey(me.input.KEY.W, 'up');
      me.input.bindKey(me.input.KEY.DOWN, 'down');
      me.input.bindKey(me.input.KEY.S, 'down');

      // Start the game.
      me.state.change(me.state.PLAY);

      setTimeout(this.gameReady);
  },
  'fireBullet': function(source, target, broadcast) {
    var obj = me.entityPool.newInstanceOf('bullet', source.x, source.y, {
        image: 'bullet',
        spritewidth: 24,
        spriteheight: 24,
        target: target
    });

    me.game.add(obj, 4);
    me.game.sort();
    if(broadcast) {
      this.socket.emit('fireBullet', source, target);
    }
  },
  'updatePlayerState': function(data) {
    var player = this.players[data.id];
    if(player) {
      player.state = data.s;
      player.pos.x = data.p.x;
      player.pos.y = data.p.y;
    }
  },
  'removeEnemy': function(data) {
    console.log('removing player', data.id);
    var enemy = this.players[data.id];
    me.game.remove(enemy);
    delete this.players[data.id];
  },
  'addEnemy': function(data) {
    if(!data || this.players[data.id]) { return; }

    console.log('adding player', data);
    var player = me.entityPool.newInstanceOf('enemyPlayer', data.p.x, data.p.y, {
        image: 'boy',
        spritewidth: 48,
        spriteheight: 48,
    });
    this.players[data.id] = player;
    me.game.add(player, data.z);
    me.game.sort();
  }
};
