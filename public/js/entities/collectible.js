game.NetworkPlayerEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
        this.step = 0;
        this.id = settings.id;
        this.health = 3;

        this.isCollidable = true;
        this.type = game.ENEMY_OBJECT;

        this.renderable.addAnimation('run-down', [0, 4, 8, 12], 1);
        this.renderable.addAnimation('run-left', [1, 5, 9, 13], 1);
        this.renderable.addAnimation('run-up', [2, 6, 10, 14], 1);
        this.renderable.addAnimation('run-right', [3, 7, 11, 15], 1);
        this.renderable.addAnimation('hit', [0, 1, 2, 3], 1);
        this.renderable.setCurrentAnimation('run-down');
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(4, 4);
        this.state = {};
    },

    update: function () {
        this.vel.x = 0;
        this.vel.y = 0;
        if (!Object.keys(this.state).length) {
            return false;
        }

        if (this.state.ghost) {
            var ghost = this;
            ghost.renderable.alpha = 0.25;
            ghost.invincible = true;

            setTimeout(function () {
                ghost.renderable.alpha = 1;
                ghost.invincible = false;
            }, 1500);
        }

        if (this.state.left) {
            this.renderable.setCurrentAnimation('run-left');
        }

        if (this.state.left) {
            this.renderable.setCurrentAnimation('run-left');
        }

        if (this.state.right) {
            this.renderable.setCurrentAnimation('run-right');
        }

        if (this.state.up) {
            this.renderable.setCurrentAnimation('run-up');
        }

        if (this.state.down) {
            this.renderable.setCurrentAnimation('run-down');
        }

        this.state = {};
        return true;
    }
});
