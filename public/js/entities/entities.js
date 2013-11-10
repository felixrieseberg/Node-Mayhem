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

    if(this.state['ghost']) {
        var ghost = this;
        ghost.renderable.alpha = 0.25;
        ghost.invincible = true;
        setTimeout(function() { 
            ghost.renderable.alpha = 1; 
            ghost.invincible = false; 
        }, 1500);
    }

    if (this.state['left']) {
        this.renderable.setCurrentAnimation('run-left');
    }

    if (this.state['left']) {
      this.renderable.setCurrentAnimation('run-left');
    }

    if (this.state['right']) {
      this.renderable.setCurrentAnimation('run-right');
    }

    if (this.state['up']) {
      this.renderable.setCurrentAnimation('run-up');
    }

    if (this.state['down']) {
      this.renderable.setCurrentAnimation('run-down');
    }

    this.state = {};
    return true;
  }
});

game.PlayerEntity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);

        //bounding
        this.updateColRect(13, 26, 12, 30);
        this.gravity = 0;
        this.isWeaponCoolDown = false;
        this.weaponCoolDownTime = 500;

        // set up health (top 3, bottom 0)
        this.health = 3;

        // set up multiplayer
        this.isMP = settings.isMP;
        this.step = 0;

        // set up mouseCoordinates
        game.mouseTarget = { x: 0, y: 0 };

        this.isCollidable = true;
        this.type = game.MAIN_PLAYER_OBJECT;

        this.renderable.addAnimation('run-down', [0, 1, 2, 3], 1);
        this.renderable.addAnimation('run-left', [4, 5, 6, 7], 1);
        this.renderable.addAnimation('run-up', [8, 9, 10, 11], 1);
        this.renderable.addAnimation('run-right', [12, 13, 14, 15], 1);
        this.renderable.addAnimation('hit', [0, 4, 8, 12], 1);
        this.renderable.setCurrentAnimation('run-down');
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(4, 4);

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function () {
        this.vel.x = 0;
        this.vel.y = 0;

        if (me.input.isKeyPressed('shoot')) {
            if (!this.isWeaponCoolDown && me.input.isKeyPressed('shoot')) {
                this.isWeaponCoolDown = true;
                var player = this;

                audioManager.playSound("shoot");

                setTimeout(function () { player.isWeaponCoolDown = false; }, this.weaponCoolDownTime);
                game.fireBullet({ x: this.pos.x + 12, y: this.pos.y + 12 }, game.mouseTarget, true);
            }
        }

        var stateChanged = false;
        var state = {};
        if (me.input.isKeyPressed('left')) {
            this.renderable.setCurrentAnimation('run-left');
            this.vel.x -= this.accel.x * me.timer.tick;
            state['left'] = true;
            stateChanged = true;
        }

        if (me.input.isKeyPressed('right')) {
            this.renderable.setCurrentAnimation('run-right');
            this.vel.x += this.accel.x * me.timer.tick;
            state['right'] = true;
            stateChanged = true;
        }

        if (me.input.isKeyPressed('up')) {
            this.renderable.setCurrentAnimation('run-up');
            this.vel.y = -this.accel.y * me.timer.tick;
            state['up'] = true;
            stateChanged = true;
        }

        if (me.input.isKeyPressed('down')) {
            this.renderable.setCurrentAnimation('run-down');
            this.vel.y = this.accel.y * me.timer.tick;
            state['down'] = true;
            stateChanged = true;
        }

        this.updateMovement();

        if (stateChanged) {
            game.socket.emit('updatePlayerState', { x: this.pos.x, y: this.pos.y }, state);
        }

        //check for collisions
        var res = me.game.collide(this);

        return true;
    }
});

game.BulletEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.gravity = 0;
    this.collidable = true;
    this.canBreakTile = true;

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

  onCollision: function () {
    console.log("Collision omgwtfbbq!");
  },

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
    
    var bullet = this;
    // check for collision
    var res = me.game.collide(this);
    if (res && res.obj.type === game.ENEMY_OBJECT && !res.obj.invincible) {
        me.game.remove(bullet);
        game.hitPlayer(res.obj.id);
    }
    else if (res && res.obj.type === game.COLLIDE_OBJECT) {
        me.game.remove(bullet);
    }
  }
});

game.CrateEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, settings);
    this.type = me.game.COLLIDE_OBJECT;
  },

  onCollision: function (res, obj) {
    console.log(obj);
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
        // do something when collected
        console.log("got da gun");
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
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
      // do something when collected
      console.log("got da medpack");
      // make sure it cannot be collected "again"
      this.collidable = false;
      // remove it
      me.game.remove(this);
      obj.health++;
      game.data.health++;
      console.log(game.data.health);
    }
    else {
      console.log("not player");
    }
  }
});
