// The HUD - responsible for displaying hearts and the points in the
// upper right
/* ----------------------------------------------------------------- */
game.HUD = game.HUD || {};

game.HUD.Container = me.ObjectContainer.extend({
    init: function () {
        // call the constructor
        this.parent();

        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = 'HUD';

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(1180, 20));
        this.addChild(new game.HUD.HealthItem(20, 20));
    }
});

// Health
game.HUD.HealthItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function (x, y) {
        // call the parent constructor
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10);

        // create a font
        this.font = new me.BitmapFont('32x32_font', 32);
        this.font.set('left');

        // local copy of the global score
        this.score = -1;

        // make sure we use screen coordinates
        this.floating = true;
    },

    /**
     * update function
     */
    update: function () {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw: function (context) {
        // draw it baby !
        var playerHealth;

        if (game.data.health === 5) {
            playerHealth = '$$$$$';
        } else if (game.data.health === 4) {
            playerHealth = '$$$$';
        } else if (game.data.health === 3) {
            playerHealth = '$$$';
        } else if (game.data.health === 2) {
            playerHealth = '$$';
        } else if (game.data.health === 1) {
            playerHealth = '$';
        } else if (game.data.health === 0) {
            playerHealth = '';
        }

        this.font.draw(context, playerHealth, this.pos.x, this.pos.y);
    }

});

// Score
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function (x, y) {
        // call the parent constructor
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10);

        // create a font
        this.font = new me.BitmapFont('32x32_font', 32);
        this.font.set('right');

        // local copy of the global score
        this.score = -1;

        // make sure we use screen coordinates
        this.floating = true;
    },

    /**
     * update function
     */
    update: function () {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw: function (context) {
        this.font.draw(context, game.data.score, this.pos.x, this.pos.y);
    }

});
