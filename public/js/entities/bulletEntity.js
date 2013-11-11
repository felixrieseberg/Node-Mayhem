// Entity "Bullet": Managing the life cycle of the bullet once
// it has been shot.
/* ----------------------------------------------------------------- */
game.BulletEntity = me.ObjectEntity.extend({
  // Bullet is being created
  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.gravity = 0;
    this.collidable = true;
    this.canBreakTile = true;
    this.id = settings.id;

    this.shotAngle = settings.angle;
    this.renderable.angle = this.shotAngle;
    this.maxVelocity = settings.maxVelocity || 15;

    var localX = (settings.target.x - x);
    var localY = (settings.target.y - y);

    var localTargetVector = new me.Vector2d(localX, localY);
    localTargetVector.normalize();
    localTargetVector.scale(new me.Vector2d(this.maxVelocity, this.maxVelocity));

    this.setVelocity(localTargetVector.x, localTargetVector.y);
  },

  // Updating the state of the bullet every single frame
  update: function () {
    this.vel.x += this.accel.x * me.timer.tick;
    this.vel.y += this.accel.y * me.timer.tick;
    this.computeVelocity(this.vel);
    this.updateMovement();
    var bullet = this;
    if (this.vel.x==0 || this.vel.y==0)
    {
       me.game.remove(bullet);
    }
    
    // check for collision with other objects
    var res = me.game.collide(this);
    if (res && res.obj.id != bullet.id && !res.obj.invincible) {
        me.game.remove(bullet);
        game.hitPlayer(bullet.id, res.obj.id);
    }
    else if (res && res.obj.type === game.COLLIDE_OBJECT) {
        me.game.remove(bullet);
    }
  }
});