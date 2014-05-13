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
    //this.setVelocity(4, 4); //Not needed .. we do not do client predicion yet.
    this.state = {};
    this.lastAnimationUsed = "run-down"; // Needed to prevent animation timer to be resett.. wich seam to happen otherwise
    this.animationToUseThisFrame = "run-down"; // Needed to prevent animation timer to be resett.. wich seam to happen otherwise
  },

  update: function (dt) {
    this.vel.x = 0;
    this.vel.y = 0;
    if (!Object.keys(this.state).length) {
      return false;
    }
    /*
    if(this.state['ghost']) {
        var ghost = this;
        ghost.renderable.alpha = 0.25;
        ghost.invincible = true;
        setTimeout(function() { 
            ghost.renderable.alpha = 1; 
            ghost.invincible = false; 
        }, 1500);
    }
    */

    if (this.state['left']) {
      this.animationToUseThisFrame = 'run-left';
    }

    if (this.state['right']) {
      this.animationToUseThisFrame = 'run-right';
    }

    if (this.state['up']) {
      this.animationToUseThisFrame = 'run-up';
    }

    if (this.state['down']) {
      this.animationToUseThisFrame = 'run-down';
    }

    if (this.animationToUseThisFrame != this.lastAnimationUsed) {
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

    //console.log(settings.image);
    this.parent(x, y, settings);

    //bounding
    this.addShape(new me.Rect(new me.Vector2d(7,10), 32, 32));
    
    this.gravity = 0;
    this.isWeaponCoolDown = false;
    this.weaponCoolDownTime = 500;

    // set up health (top 3, bottom 0)
    this.health = 3;
    this.id = settings.id;

    // set up multiplayer
    this.isMP = settings.isMP;
    this.step = 0;

    // set up mouseCoordinates
    game.mouseTarget = { x: 0, y: 0 };

    this.isCollidable = true;
    this.type = game.MAIN_PLAYER_OBJECT;
    this.state = {up:false, down:false, right:false, left:false}; //Only used to tell other clients what anim to use right now but will be reworked to tell server and other clients how to simulate and do predictions in simulation
    this.stateChanged = false;
    this.lastAnimationUsed = "run-down"; // Needed to prevent animation timer to be resett.. wich seam to happen otherwise
    this.animationToUseThisFrame = "run-down"; // Needed to prevent animation timer to be resett.. wich seam to happen otherwise
    
    //this.setVelocity(4, 4); Not need t separate x and y forces.. since top-down game
    this.accelForce = 4;
    

    this.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
    this.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
    this.renderable.addAnimation('run-up', [8, 9, 10, 11], 100);
    this.renderable.addAnimation('run-right', [12, 13, 14, 15], 100);
    this.renderable.addAnimation('hit', [0, 4, 8, 12], 100);
    this.renderable.setCurrentAnimation('run-down');
    // set the default horizontal & vertical speed (accel vector)
    
    
    
    this.maxVel.x = this.maxVel.y =  25; //Slow fps can force bigger steps .. will find out how to override this since I plan to ad more physicslike sim later

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
  },
  update: function (dt) {
    this.vel.x = 0;
    this.vel.y = 0;
    this.g_dt = dt /20 ; //To be able to keep original values of velocity but still use dt.
    /*
    if (this.state['ghost']) {
      var ghost = this;
      ghost.renderable.alpha = 0.25;
      ghost.invincible = true;
      setTimeout(function () { //Not the most elegant solution .. since this will be caled at every update during the 1,5 sec long ghost period .. 
        //and aslo when killed create a error since 1,5 sec after kill-hit .. the this=ghost .. does not exesit anymore.
        ghost.renderable.alpha = 1;
        ghost.invincible = false;
      }, 1500);
      //The above is moved to game.hitPlayer since its more natural to ajust it from there .. not in the update loop.


    }
    */

    if (me.input.isKeyPressed('shoot')) {
      if (!this.isWeaponCoolDown && me.input.isKeyPressed('shoot')) {
        this.isWeaponCoolDown = true;
        var player = this;

        setTimeout(function () { player.isWeaponCoolDown = false; }, this.weaponCoolDownTime);
        game.fireBullet({ x: this.pos.x + 12, y: this.pos.y + 12 }, game.mouseTarget, game.playerId, true);
      }
    }

    this.stateChanged = false;
    if (me.input.isKeyPressed('left')) {
      this.animationToUseThisFrame = 'run-left';
      this.vel.x -= 1; //Just set upp direction. calc actual vel later
      this.state['left'] = true;
      this.stateChanged = true;
    } else {
      this.state['left'] = false;
    }

    if (me.input.isKeyPressed('right')) {
      this.animationToUseThisFrame = 'run-right';
      this.vel.x += 1;
      this.state['right'] = true;
      this.stateChanged = true;
    } else {
      this.state['right'] = false;
    }

    if (me.input.isKeyPressed('up')) {
      this.animationToUseThisFrame = 'run-up';
      this.vel.y -= 1;
      this.state['up'] = true;
      this.stateChanged = true;
    } else {
      this.state['up'] = false;
    }

    if (me.input.isKeyPressed('down')) {
      this.animationToUseThisFrame = 'run-down';
      this.vel.y += 1;
      this.state['down'] = true;
      this.stateChanged = true;
    } else {
      this.state['down'] = false;
    }
    if (this.animationToUseThisFrame != this.lastAnimationUsed) {
      this.lastAnimationUsed = this.animationToUseThisFrame;
      this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
    }


    //Now calc actual vel to prevent speeding by going diag.. 
    this.vel.normalize();
    this.vel.scale(this.accelForce * this.g_dt);
    
    this.updateMovement();

    

    //check for collisions
    var res = me.game.world.collide(this);
    if(res) {
      if (res.obj.type == "solid") {
        this.pos.x -= res.x;
        this.pos.y -= res.y;
        if (res.x) this.vel.x = 0; //Thse 2 lines not usefull in this implementation since we do not keep values any way .. but will be used if we do more acurate simulation in future.
        if (res.y) this.vel.y = 0;
      }
    }

    if (this.stateChanged) { //Only update animation and brodcast if we actualy need.
      game.socket.emit('updatePlayerState', { x: this.pos.x, y: this.pos.y }, this.state);
      this.parent(dt);
      return true;
    } else { 
      return false;
    }
    
    
  }
});
