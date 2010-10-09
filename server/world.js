var Vector2D = require('./../client/js/vector2d').vector2D;
var TwitterNode = require('twitter-node').TwitterNode;
var sys = require('sys');

var map = require('./map').map;
var mapStart = new Vector2D(parseInt(map.start.x), parseInt(map.start.y));
console.dir(map.start);

var twitterUser = "734m";
var twitterPassword = "MYPASSWORDHERE"

var players = {};
var twitters = {};

function cleanupTwitter(playerId) {
  if (twitters.hasOwnProperty(playerId)) {
    try {
      twitters[playerId]._clientResponse.connection.destroy();
      delete twitters[playerId];
    } catch(e) {
      console.log("Error: playerId not found to have any twitters.")
      console.log(e)
    }
  }
}

var APPEARANCES = ["littleguy", "giftersuit", "gifter", "beast"];
var appearanceIndex = Math.floor(Math.random() * APPEARANCES.length);
function getAppearance() {
  // round robin style appearances
  appearanceIndex = (appearanceIndex + 1) % APPEARANCES.length;
  console.log(appearanceIndex)
  return APPEARANCES[appearanceIndex];
}

exports.map = map;
exports.players = players;

exports.connect = function(playerId) {
  // init guy
  var startOffset = Vector2D.random(-3, -3, 3, 3);
  var position = mapStart.plus(startOffset);
  console.log([startOffset, position]);
  
  players[playerId] = {
    name: "init", // TODO rename to add_player?
    x: position.x,
    y: position.y,
    playerId: playerId,
    appearance: getAppearance()
  };
  console.log('player ' + playerId + ' entered the world, appearing as ' + players[playerId].appearance);

  // TODO send back all other players too

  return players[playerId];
};

exports.disconnect = function(playerId) {
  // TODO move guy into autonomous mode
  var player = players[playerId];
  cleanupTwitter(playerId);
  delete players[playerId];
  console.log('player ' + playerId + ' left the world');
  player.name = 'delete_player';
  return player;
};

exports.process = function(playerId, cmd, callback) {
  console.log('player ' + playerId + ' says: ' + JSON.stringify(cmd));

  if (cmd.name == 'move_req') {
    var v1 = new Vector2D(cmd.x1, cmd.y1);
    var v2 = new Vector2D(cmd.x2, cmd.y2);
    var dt = v2.subtract(v1);
    var direction;

    if (dt.x == 0 && dt.y == 0) {
      direction = 'stop';
    } else if (Math.abs(dt.x) >= Math.abs(dt.y)) {
      direction = dt.x < 0 ? 'left' : 'right';
    } else {
      direction = dt.y < 0 ? 'up' : 'down';
    }

    players[playerId].x = cmd.x2;
    players[playerId].y = cmd.y2;

    callback({name: "move", direction: direction, x2: cmd.x2, y2: cmd.y2, playerId: playerId});
  } else if(cmd.name == "talk") {
    cleanupTwitter(playerId);
    callback(cmd);
  } else if(cmd.name == "search") {
    // before searching, immediately broadcast a "talk" so other people
    // see stuff
    var thinking = {name: "talk", playerId: playerId, message: 'Thinking about "' + cmd.message + '"...'}
    callback(thinking);

    cleanupTwitter(playerId);

    var twitter = twitters[playerId] = new TwitterNode({
      user: '734m',
      password: 'MYPASSWORDHERE',
      track: [cmd.message]
    });

    twitter.addListener('error', function(e) {
      console.dir(e)
    }).addListener('tweet', function(tweet) {
      cmd.message = '@' + tweet.user.screen_name + ': ' + tweet.text;
      cmd.name = 'talk';
      callback(cmd);
    }).stream();

  } else if (cmd.name == 'shush') {
    cleanupTwitter(playerId);
    callback(cmd);
  } else {
    callback({name: "noop", playerId: playerId});
  }

  // TODO send back all other players too
};
