// Entity "Bullet": Managing the life cycle of the bullet once
// it has been shot.
/* ----------------------------------------------------------------- */
game.BulletEntity = me.ObjectEntity.extend({
    // Bullet is being created
    init: function (x, y, settings) {
        var localX, localY, localTargetVector;

        this.parent(x, y, settings);
        this.addShape(new me.Rect(new me.Vector2d(0, 0), 24, 24));
        this.gravity = 0;
        this.collidable = true;
        this.canBreakTile = true;
        this.id = settings.id;

        this.shotAngle = settings.angle;
        this.renderable.angle = this.shotAngle;
        this.maxVelocity = settings.maxVelocity || 15;

        localX = (settings.target.x - x);
        localY = (settings.target.y - y);

        localTargetVector = new me.Vector2d(localX, localY);
        localTargetVector.normalize();
        localTargetVector.scaleV(new me.Vector2d(this.maxVelocity, this.maxVelocity));

        this.setVelocity(localTargetVector.x, localTargetVector.y);
    },

    // Updating the state of the bullet every single frame
    update: function () {
        var bullet, res;

        this.vel.x += this.accel.x * me.timer.tick;
        this.vel.y += this.accel.y * me.timer.tick;
        this.computeVelocity(this.vel);
        this.updateMovement();

        bullet = this;

        if (this.vel.x === 0 || this.vel.y === 0) {
            me.game.world.removeChild(bullet);
        }

        // check for collision with other objects
        res = me.game.world.collide(this);
        if (res && res.obj.id !== bullet.id && !res.obj.invincible) {
            me.game.world.removeChild(bullet);
            game.hitPlayer(bullet.id, res.obj.id);
        } else if (res && res.obj.type === game.COLLIDE_OBJECT) {
            me.game.wordl.removeChild(bullet);
        }
    }
});
