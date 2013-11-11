// Extra entitities - a rock, a crate and a medpack
/* ----------------------------------------------------------------- */
game.CrateEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.type = "SOLID";
  },

  onCollision: function (res, obj) {
    if (obj.type != game.MAIN_PLAYER_OBJECT) {
      this.collidable = false;
      me.game.remove(this);

      var medpack = me.entityPool.newInstanceOf('medpack', this.pos.x, this.pos.y, {
        image: 'medpack',
        spritewidth: 48,
        spriteheight: 48
      });
      me.game.add(medpack, this.z);
      me.game.sort();
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
        me.game.remove(this);
    }
});

game.MedpackEntity = me.CollectableEntity.extend({
    init: function (x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.type = me.game.COLLECTABLE_OBJECT;
    },
    onCollision: function (res, obj) {
        //only collected by player
        if (obj.type == game.MAIN_PLAYER_OBJECT) {
            this.collidable = false;
            // remove it
            me.game.remove(this);
            audioManager.playSound("powerup");
            obj.health++;
            game.data.health++;
            if (game.data.health > 5) {
                game.data.health = 5;
            }
            if (obj.health > 5) {
                obj.health = 5;
            }
            game.socket.emit('playerHealed', { id: obj.id, health: game.data.health });
        } else if (obj.type == game.ENEMY_OBJECT) {
            me.game.remove(this);
        }
    }
});