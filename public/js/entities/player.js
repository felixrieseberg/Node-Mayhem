// Player entities - both for the local player as well as the
// network player
/* ----------------------------------------------------------------- */
game.NetworkPlayerEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
        this.step = 0;
        this.id = settings.id;
        this.health = 3;

        this.isCollidable = true;
        this.type = game.ENEMY_OBJECT;

        this.renderable.addAnimation('run-down', [0, 4, 8, 12], 100);
        this.renderable.addAnimation('run-left', [1, 5, 9, 13], 100);
        this.renderable.addAnimation('run-up', [2, 6, 10, 14], 100);
        this.renderable.addAnimation('run-right', [3, 7, 11, 15], 100);
        this.renderable.addAnimation('hit', [0, 1, 2, 3], 100);
        this.renderable.setCurrentAnimation('run-down');
        // set the default horizontal & vertical speed (accel vector)

        this.state = {};
        this.lastAnimationUsed = 'run-down';
        this.animationToUseThisFrame = 'run-down';
    },

    update: function (dt) {
        this.vel.x = 0;
        this.vel.y = 0;

        if (!Object.keys(this.state).length) {
            return false;
        }

        if (this.state.left) {
            this.animationToUseThisFrame = 'run-left';
        }

        if (this.state.right) {
            this.animationToUseThisFrame = 'run-right';
        }

        if (this.state.up) {
            this.animationToUseThisFrame = 'run-up';
        }

        if (this.state.down) {
            this.animationToUseThisFrame = 'run-down';
        }

        if (this.animationToUseThisFrame !== this.lastAnimationUsed) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }

        this.state = {};
        this.parent(dt);
        return true;
    }
});

game.PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);

        // Bounding
        this.addShape(new me.Rect(new me.Vector2d(7, 10), 32, 32));
        this.gravity = 0;
        this.isWeaponCoolDown = false;
        this.weaponCoolDownTime = 500;

        // Set up health (top 3, bottom 0)
        this.health = 3;
        this.id = settings.id;

        // Set up multiplayer
        this.isMP = settings.isMP;
        this.step = 0;

        // Set up mouseCoordinates
        game.mouseTarget = {
            x: 0,
            y: 0
        };

        this.isCollidable = true;
        this.type = game.MAIN_PLAYER_OBJECT;
        this.state = {
            up: false,
            down: false,
            right: false,
            left: false
        };

        // Only used to tell other clients what anim to use right now but will be reworked to tell server
        // and other clients how to simulate and do predictions in simulation
        this.stateChanged = false;
        this.lastAnimationUsed = 'run-down';
        this.animationToUseThisFrame = 'run-down';

        this.accelForce = 4;
        this.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
        this.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
        this.renderable.addAnimation('run-up', [8, 9, 10, 11], 100);
        this.renderable.addAnimation('run-right', [12, 13, 14, 15], 100);
        this.renderable.addAnimation('hit', [0, 4, 8, 12], 100);
        this.renderable.setCurrentAnimation('run-down');
        this.maxVel.x = this.maxVel.y = 25;

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function (dt) {
        var res, player;

        this.vel.x = 0;
        this.vel.y = 0;
        this.g_dt = dt / 20;

        if (me.input.isKeyPressed('shoot')) {
            if (!this.isWeaponCoolDown && me.input.isKeyPressed('shoot')) {
                this.isWeaponCoolDown = true;
                player = this;

                setTimeout(function () {
                    player.isWeaponCoolDown = false;
                }, this.weaponCoolDownTime);
                game.fireBullet({
                    x: this.pos.x + 12,
                    y: this.pos.y + 12
                }, game.mouseTarget, game.playerId, true);
            }
        }

        this.stateChanged = false;

        if (me.input.isKeyPressed('left')) {
            this.animationToUseThisFrame = 'run-left';
            this.vel.x -= 1;
            this.state.left = true;
            this.stateChanged = true;
        } else {
            this.state.left = false;
        }

        if (me.input.isKeyPressed('right')) {
            this.animationToUseThisFrame = 'run-right';
            this.vel.x += 1;
            this.state.right = true;
            this.stateChanged = true;
        } else {
            this.state.right = false;
        }

        if (me.input.isKeyPressed('up')) {
            this.animationToUseThisFrame = 'run-up';
            this.vel.y -= 1;
            this.state.up = true;
            this.stateChanged = true;
        } else {
            this.state.up = false;
        }

        if (me.input.isKeyPressed('down')) {
            this.animationToUseThisFrame = 'run-down';
            this.vel.y += 1;
            this.state.down = true;
            this.stateChanged = true;
        } else {
            this.state.down = false;
        }
        if (this.animationToUseThisFrame !== this.lastAnimationUsed) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }

        this.vel.normalize();
        this.vel.scale(this.accelForce * this.g_dt);
        this.updateMovement();

        // Check for collisions
        res = me.game.world.collide(this);
        if (res) {
            if (res.obj.type === 'solid') {
                this.pos.x -= res.x;
                this.pos.y -= res.y;
                if (res.x) {
                    this.vel.x = 0;
                }
                if (res.y) {
                    this.vel.y = 0;
                }
            }
        }

        if (this.stateChanged) {
            game.socket.emit('updatePlayerState', {
                x: this.pos.x,
                y: this.pos.y
            }, this.state);
            this.parent(dt);
            return true;
        } else {
            return false;
        }
    }
});
