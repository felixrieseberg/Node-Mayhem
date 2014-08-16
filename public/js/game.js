// Melon.js: Setting up the game object
/* ----------------------------------------------------------------- */
var game = {
    // Some pseudo-global variables we want to have in game.*
    data: {
        score: 0,
        health: 3,
        volume: 1
    },
    playerId: '',
    players: {},
    mouseTarget: {},
    gameReady: function () { console.log('default game ready'); },
    MAIN_PLAYER_OBJECT: 4,
    ENEMY_OBJECT: 5,
    mainPlayer: {},

    // OnLoad: Executed once the game loads
    'onload': function () {
        me.sys.pauseOnBlur = false;
        me.sys.fps = 120;
        if (!me.video.init('screen', 1200, 600, true)) {
            alert('Your browser does not support HTML5 canvas.');
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        // Set up pointer events
        me.input.registerPointerEvent('pointermove', me.game.viewport, function (e) {
            game.mouseTarget = { x: e.gameWorldX, y: e.gameWorldY };
        });
        
        me.audio.init('ogg,mp3');
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.resources);
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    'loaded': function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        
        me.debug.renderHitBox = true;

        // Setting up the entitiy pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("enemyPlayer", game.NetworkPlayerEntity);
        me.pool.register("bullet", game.BulletEntity, true);
        me.pool.register("gun", game.GunEntity, true);
        me.pool.register("medpack", game.MedpackEntity, true);
        me.pool.register("CrateEntity", game.CrateEntity);
        me.pool.register("RockEntity", game.RockEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.SPACE, 'shoot');
        // map the left button click on the X key
        me.input.bindPointer(0, me.input.KEY.SPACE);

        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.A, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');
        me.input.bindKey(me.input.KEY.D, 'right');
        me.input.bindKey(me.input.KEY.UP, 'up');
        me.input.bindKey(me.input.KEY.W, 'up');
        me.input.bindKey(me.input.KEY.DOWN, 'down');
        me.input.bindKey(me.input.KEY.S, 'down');

        //this.mainPlayer = new 

        // Start the game.
        //this.gameReady();
        me.state.change(me.state.PLAY);
        
    },

    'fireBullet': function (source, target, id, broadcast) {
        var obj = me.pool.pull('bullet', source.x, source.y, {
            image: 'bullet',
            spritewidth: 24,
            spriteheight: 24,
            width:24,
            height:24,
            target: target,
            id: id
        });

        me.game.world.addChild(obj, 6);
        //me.game.world.sort();
        audioManager.playSound("shoot");
        if (broadcast) {
            this.socket.emit('fireBullet', id, source, target);
        }
    },

    'updatePlayerScore': function (data) {

    },

    'updatePlayerState': function (data) {
        var player = this.players[data.id];
        if (player) {
            player.state = data.s;
            player.pos.x = data.p.x;
            player.pos.y = data.p.y;
        }
    },

    'removeEnemy': function (data) {
        console.log('removing player', data.id);
        var enemy = this.players[data.id];
        me.game.world.removeChild(enemy);
        delete this.players[data.id];
    },

    'remotePlayerHealthChanged': function (data) {
        if (!data.id || !this.players[data.id]) { return; }
        this.players[data.id].health = data.health;
    },

    'killPlayer': function (id) {
        if (!id || !this.players[id]) { return; }
        this.socket.emit('resetPlayer');
        this.mainPlayer = {};
        me.game.world.removeChild(this.players[id]);
        delete this.players[id];
    },

    'hitPlayer': function (sourceId, targetId) {
        if (!targetId || !this.players[targetId]) { return; }

        var player = this.players[targetId];
        player.health--;
        
        if (player.health > 0) { //if not killed by that last hit... since then object will be reseted .. and disapear.
            player.state['ghost'] = true; //Not nececary .. will do every setting heare instead -- I think
            player.renderable.alpha = 0.25;  
            player.invincible = true;
            var ghost = player;  //Think this is neccacey to make the function know who player is .. 
            setTimeout(function() { 
                player.renderable.alpha = 1; 
                player.invincible = false; 
            }, 1500);
        }   

        if (targetId === game.mainPlayer.id) {
            game.data.health--;
            this.socket.emit('playerHit', { id: targetId, health: player.health });

            if (player.health <= 0) {
                game.killPlayer(targetId);
            }
        }

        if (game.mainPlayer.id == sourceId) {
            this.socket.emit('scoreHit');
        }
    },

    'addEnemy': function (data) {
        if (!data || this.players[data.id]) { return; }

        console.log('adding player', data);
        var player = me.pool.pull('enemyPlayer', data.p.x, data.p.y, {
            image: 'boy',
            spritewidth: 48,
            spriteheight: 48,
            width:48,
            height:48,
            id: data.id,
            health: data.health
        });
        this.players[data.id] = player;
        me.game.world.addChild(player, data.z);
        me.game.world.sort();
    },

    'addMainPlayer': function (data) {
        if (!data) { return; }
        console.log("mainPlayer: at x:"+ data.p.x+", y:"+data.p.y);
        this.mainPlayer = me.pool.pull('mainPlayer', data.p.x, data.p.y, {
            image: 'girl',
            spritewidth: 48,
            spriteheight: 48,
            width:48,
            height:48,
            id: data.id,
            health: data.health
        });
        console.log("maxvel"+this.mainPlayer.maxVel.x);
        game.data.health = data.health;

        this.players[data.id] = this.mainPlayer;
        me.game.world.addChild(this.mainPlayer, data.z);
    }
};
