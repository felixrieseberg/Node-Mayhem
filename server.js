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
  res.render('index');
});

app.get('/game', function(req, res) {
  res.render('game');
});

var server = http.createServer(app);

var io = socketio.listen(server);

var players = {};
var highScores = {};
io.set('log level', 0);
io.on('connection', function(socket) {
  var playerInactiveTimeout;
  socket.on('gameReady', function(data) {
    socket.sessionId = data.id;
    socket.playerName = data.name;
    if(players[data.id]) {
      removeInactivePlayer();
    }
    var player = { id: data.id, z: 4, health: 3, score: 0, p: { x: 8 * 48, y: 2 * 48 }, n: socket.playerName };
    highScores[data.id] = { name: socket.playerName, score: 0 };
    socket.broadcast.emit('addPlayer', player);
    players[data.id] = player;
    socket.emit('playerId', data.id);
    socket.emit('addMainPlayer', player);
    socket.emit('addPlayers', players);
    io.sockets.emit('highScores', highScores);
    playerActive();
  });

  function playerActive() {
    if(playerInactiveTimeout) {
      clearTimeout(playerInactiveTimeout);
    }
    playerInactiveTimeout = setTimeout(removeInactivePlayer, 120000);
  }

  function removeInactivePlayer() {
    io.sockets.emit('removePlayer', socket.sessionId);
    delete players[socket.sessionId];
  }

  socket.on('updatePlayerState', function(position, state) {
    if(!players[socket.sessionId]) {
      return;
    }

    playerActive();
    players[socket.sessionId].p = position;
    socket.broadcast.emit('updatePlayerState', { id: socket.sessionId, p: position, s: state });
  }); 

  socket.on('fireBullet', function(id, source, target) {
    playerActive();
    socket.broadcast.emit('fireBullet', id, source, target);
  });

  socket.on('playerHit', function(data) {
    socket.broadcast.emit('playerHit', data);
  });

  socket.on('scoreHit', function() {
    var player = players[socket.sessionId];
    if(!player) {
      return;
    }
    player.score = player.score ? player.score + 100 : 100;
    socket.emit('score', player.score);
    highScores[player.id] = { name: player.n, score: player.score };
    io.sockets.emit('highScores', highScores);
  });

  socket.on('resetPlayer', function() {
    player = { id: socket.sessionId, z: 4, score: 0, health: 3, p: { x: 8 * 48, y: 2 * 48 }, n: socket.playerName };
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
