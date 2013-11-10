game.CrateEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.type = me.game.COLLIDE_OBJECT;
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
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.collidable = true;
        this.type = me.game.COLLIDE_OBJECT;
    }
});
game.GunEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.type = me.game.COLLIDE_OBJECT;
    },
    onCollision: function () {
        this.collidable = false;
        me.game.remove(this);
    }
});

game.MedpackEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.type = me.game.COLLECTABLE_OBJECT;
    },
    onCollision: function (res, obj) {
        //only collected by player
        if (obj.type == game.MAIN_PLAYER_OBJECT) {
            console.log('PLAYER HEALED');
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
            console.log('ENEMY HEALED');
            me.game.remove(this);
        }
        else {
            console.log("CWTFOMGBBQ!");
        }
    }
});