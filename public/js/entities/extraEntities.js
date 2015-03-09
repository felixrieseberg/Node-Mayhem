/* global audioManager */

// Extra entitities - a rock, a crate and a medpack
/* ----------------------------------------------------------------- */
game.CrateEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.type = 'solid';
        this.collidable = true;
    },

    onCollision: function (res, obj) {
        if (obj.type !== game.MAIN_PLAYER_OBJECT) {
            this.collidable = false;
            me.game.world.removeChild(this);

            var medpack = me.pool.pull('medpack', this.pos.x, this.pos.y, {
                image: 'medpack',
                spritewidth: 48,
                spriteheight: 48,
                width: 48,
                height: 48
            });

            me.game.world.addChild(medpack, this.z);
        }
    }
});

game.RockEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = true;
        this.type = me.game.COLLIDE_OBJECT;
    }
});
game.GunEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.type = me.game.COLLIDE_OBJECT;
    },

    onCollision: function () {
        this.collidable = false;
        me.game.world.removeChild(this);
    }
});

game.MedpackEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        // Call the parent constructor
        this.parent(x, y, settings);
        this.type = me.game.COLLECTABLE_OBJECT;
    },
    onCollision: function (res, obj) {
        // Only collected by player
        if (obj.type === game.MAIN_PLAYER_OBJECT) {
            this.collidable = false;
            me.game.world.removeChild(this);
            audioManager.playSound('powerup');
            obj.health += 1;
            game.data.health += 1;

            if (game.data.health > 5) {
                game.data.health = 5;
            }
            if (obj.health > 5) {
                obj.health = 5;
            }
            game.socket.emit('playerHealed', {
                id: obj.id,
                health: game.data.health
            });

            var respawn = function () {
                var crate = me.pool.pull('CrateEntity', this.pos.x, this.pos.y, {
                    image: 'crate',
                    spritewidth: 48,
                    spriteheight: 48,
                    width: 48,
                    height: 48
                });
                me.game.world.addChild(crate, this.z);
            };
            // respawn health crate in 90 sec
            me.timer.setTimeout(respawn.bind(this), 90000, true);
        } else if (obj.type === game.ENEMY_OBJECT) {
            me.game.world.removeChild(this);
        }
    }
});
