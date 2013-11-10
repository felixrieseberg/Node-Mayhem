require('nko')('vwPITUrcgKik0DFV');

var http = require('http'),
    path = require('path'),
    isProduction = (process.env.NODE_ENV === 'production'),
    port = isProduction ? 80 : process.env.PORT || 8000,
    express = require('express'),
    app = express(),
    socketio = require('socket.io');

app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('game');
});

app.get('/game', function(req, res) {
  res.render('game');
});

var server = http.createServer(app);

var io = socketio.listen(server);

var players = {};

io.on('connection', function(socket) {
  var playerInactiveTimeout;
  socket.on('gameReady', function() {
    var player = { id: socket.id, z: 4, p: { x: 8 * 48, y: 2 * 48 } };
    socket.broadcast.emit('addPlayer', player);
    socket.emit('addPlayers', players);
    socket.emit('addMainPlayer', player);
    socket.emit('playerId', socket.id);
    players[socket.id] = player;
    playerActive();
  });

  function playerActive() {
    if(playerInactiveTimeout) {
      clearTimeout(playerInactiveTimeout);
    }
    playerInactiveTimeout = setTimeout(removeInactivePlayer, 20000);
  }

  function removeInactivePlayer() {
    console.log('removing player');
    socket.broadcast.emit('removePlayer', socket.id);
    delete players[socket.id];
  }

  socket.on('updatePlayerState', function(position, state) {
    if(!players[socket.id]) {
      return;
    }

    playerActive();
    players[socket.id].p = position;
    socket.broadcast.emit('updatePlayerState', { id: socket.id, p: position, s: state });
  }); 

  socket.on('fireBullet', function(id, source, target) {
    playerActive();
    socket.broadcast.emit('fireBullet', id, source, target);
  });

  socket.on('playerHit', function(data) {
    console.log(data);
    socket.broadcast.emit('playerHit', data);
  });

  socket.on('resetPlayer', function() {
    player = { id: socket.id, z: 4, p: { x: 8 * 48, y: 2 * 48 } };
    socket.broadcast.emit('removePlayer', player.id);
    socket.broadcast.emit('addPlayer', player);
    socket.emit('addMainPlayer', player);
  });

  socket.on('playerHealed', function(data) {
    socket.broadcast.emit('playerHealed', data);
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
