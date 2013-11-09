var canvas = document.getElementById('example');
var engine = new Joy.Engine({
  debug: false,
  canvas: canvas,
  width: 1200,
  height: 800,

});

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) * 2,
    y: (evt.clientY - rect.top) * 2
  };
}

engine.createScene(function (scene) {
  var background = new Joy.Rect({
    position: scene.viewport.position,
    width: engine.width * 2,
    height: engine.height * 2
  });
  background.colorize("#BFE5E5");
  scene.addChild(background);

  var ship = new Joy.SpriteSheet({
    x: engine.width / 2,
    y: engine.height / 2,
    width: 36,
    height: 30,
    animations: {
      "idle": [0],
      "left": [1],
      "right": [2],
    },
    src: "/img/spaceship.gif"
  });
  ship.behave('Movimentation');
  ship.friction.set(0.1, 0.1);
  ship.maxVelocity.set(2, 2);
  ship.play("idle");

  ship.bind(Joy.Events.KEY_PRESS, function(evt) {
    if (evt.keyCode == Joy.Keyboard.KEY_W) {
      this.acceleration.y = -2;
    } else if (evt.keyCode == Joy.Keyboard.KEY_S) {
      this.acceleration.y = 2;
    }
    if (evt.keyCode === Joy.Keyboard.KEY_A) {
      this.acceleration.x = -2;
      this.play("left");

    } else if (evt.keyCode === Joy.Keyboard.KEY_D) {
      this.acceleration.x = 2;
      this.play("right");
    }
  });

  ship.bind(Joy.Events.KEY_UP, function(evt) {
    if (evt.keyCode == Joy.Keyboard.KEY_W || evt.keyCode == Joy.Keyboard.KEY_S) {
      this.acceleration.y = 0;
    }
    if (evt.keyCode === Joy.Keyboard.KEY_A || evt.keyCode === Joy.Keyboard.KEY_D) {
      this.acceleration.x = 0;
      this.play("idle");
    }
  });

  ship.fireAt = function(target) {
    console.log(target);
  };

  ship.lookAt = function(target) {
    var vector = { x: target.x - ship.position.x, y: target.y - ship.position.y };
    var theta = Math.atan2(-vector.y, vector.x);
    if (theta < 0) {
      theta += 2 * Math.PI;
    }

    var angle = (theta * (180 / Math.PI)) - 90;
    if(angle < 0) {
      angle += 360;
    }

    this.position.x -= 15;
    this.position.x -= 18;
    this.rotate(-angle);
    this.position.x += 15;
    this.position.x += 18;
  }

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    ship.lookAt(mousePos);
  }, false);

  canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    ship.fireAt(mousePos);
  }, false);

  scene.addChild(ship);
});