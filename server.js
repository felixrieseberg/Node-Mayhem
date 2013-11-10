require('nko')('vwPITUrcgKik0DFV');

var http = require('http'),
    path = require('path'),
    isProduction = (process.env.NODE_ENV === 'production'),
    port = process.env.PORT,
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

io.on('connection', function(socket) {
  var playerInactiveTimeout;
  socket.on('gameReady', function() {
    var player = { id: socket.id, z: 4, p: { x: 8 * 48, y: 2 * 48 } };
    socket.broadcast.emit('addPlayer', player);
    socket.emit('addPlayers', players);
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

  socket.on('fireBullet', function(source, target) {
    playerActive();
    socket.broadcast.emit('fireBullet', source, target);
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
