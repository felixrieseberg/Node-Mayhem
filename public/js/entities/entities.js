/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({

    init: function (x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);

        this.gravity = 0;
        this.isWeaponCoolDown = false;
        this.weaponCoolDownTime = 500;

        // set up multiplayer
        this.isMP = settings.isMP;
        this.step = 0;

        // set up mouseCoordinates
        game.felix_mouseX = 0;
        game.felix_mouseY = 0;

        this.isCollidable = true;

        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(5, 5);

        // set the display to follow our position on both axis
        if (!this.isMP) {
            me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

            window.onmousemove = this.handleMouseMove;

        }
    },

    handleMouseMove : function(event) {
        event = event || window.event; // IE-ism
        // event.clientX and event.clientY contain the mouse position
        game.felix_mouseX = event.clientX;
        game.felix_mouseY = event.clientY;
        // console.log('Recorded for client: ' + this.mouseX + ' ' + this.mouseY);
    },

    /* -----
 
    update the player pos
 
    ------ */
    update: function () {
        if (!this.isMP) {
            this.vel.x = 0;
            this.vel.y = 0;

            if (!this.isWeaponCoolDown && me.input.isKeyPressed('shoot')) {
                this.isWeaponCoolDown = true;
                var player = this;
                setTimeout(function() { player.isWeaponCoolDown = false; }, this.weaponCoolDownTime);
                var obj = me.entityPool.newInstanceOf('bullet', this.pos.x, this.pos.y, {
                image: 'bullet',
                spritewidth: 24,
                spriteheight: 24 });

                me.game.add(obj, this.z);
                me.game.sort();
            }

            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                // update the entity velocity
                this.vel.x -= this.accel.x * me.timer.tick;
            }

            if (me.input.isKeyPressed('right')) {
                // unflip the sprite
                this.flipX(false);
                // update the entity velocity
                this.vel.x += this.accel.x * me.timer.tick;
            }

            if (me.input.isKeyPressed('up')) {
                // TODO: New sprite level
                // update the entity velocity
                this.vel.y = -this.accel.y * me.timer.tick;
            }

            if (me.input.isKeyPressed('down')) {
                // TODO: New sprite level
                // update the entity velocity
                this.vel.y = this.accel.y * me.timer.tick;
            }

            // check & update player movement
            this.updateMovement();

            // Multiplayer: Fix player position
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                // Whatever we need to do hee
            }

            // Multiplayer: Let's communicate our new position
            if (!this.isMP) { // Check if it's time to send a message 
                if (this.step == 0) {
                    game.mp.sendMessage({
                        action: 'update',
                        pos: {
                            x: this.pos.x,
                            y: this.pos.y
                        },
                        vel: {
                            x: this.vel.x,
                            y: this.vel.y
                        }
                    });
                }
                if (this.step++ > 3) this.step = 0;
            }
            
            return true;
        }
    }

});

game.BulletEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
        // disable gravity
        this.gravity = 0;

        this.collidable = true;
        this.canBreakTile = true;

        // check for direction
        // this.direction = settings.direction;

        this.setVelocity(20, 0);

    },

    // Update bullet position
    update: function () {
        this.vel.x += this.accel.x * me.timer.tick;
        this.computeVelocity(this.vel);
        this.updateMovement();
    }
});