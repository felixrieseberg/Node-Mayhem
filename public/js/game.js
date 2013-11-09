
/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0
    },

    MAIN_PLAYER_OBJECT: 4,


    // Run on page load.
    'onload': function () {
        // Initialize the video.
        me.sys.pauseOnBlur = false;
        if (!me.video.init('screen', 900, 700, true, 'auto')) {
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

    // Run on game resources loaded.
    'loaded': function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // debug
        me.debug.renderHitBox = true;

        // add our player entity in the entity pool
        me.entityPool.add("mainPlayer", game.PlayerEntity);
        me.entityPool.add("bullet", game.BulletEntity, true);
        me.entityPool.add("CrateEntity", game.CrateEntity);

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

        game.mp = new Multiplayer(function (x, y) {
            // Create a new player object 
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
