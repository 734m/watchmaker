
// Dimensions
var Watchmaker = function() {

  var TILE = {
    width: 80,
    height: 45
  }

  // var mouseShadowSprite;
  var tileSprites = {};

  var mouseTilePosition;
      mouseScreenPosition = new Vector2D(),
      playerScreenPosition = new Vector2D();
  
  // Drawing
  var FRAME_RATE = 20;
  var FRAME_INTERVAL = 1000 / FRAME_RATE;
  var canvas, ctx;

  // Sprites
  var otherPlayers = {};
  var player;
  
  // Socket
  var socket;
  
  var commands = {
    init: function(cmd) {
      if (cmd.playerId == player.playerId) {
        player.setPosition(cmd.x, cmd.y);
      } else {
        var playerId = cmd.playerId;
        otherPlayers[playerId] = new Player(ctx, TILE);
        otherPlayers[playerId].playerId = playerId;
        otherPlayers[playerId].setPosition(cmd.x, cmd.y);
      }
    },

    move: function(cmd) {
      if (cmd.playerId == player.playerId) {
        player.walk(cmd.direction, new Vector2D(cmd.x2, cmd.y2));
      } else {
        otherPlayers[cmd.playerId].walk(cmd.direction, new Vector2D(cmd.x2, cmd.y2));
      }
    },

    interact: function(cmd) {
      console.log(cmd);
    },

    set_map: function(cmd) {
      for (var x in cmd.data) {
        for (var y in cmd.data[x]) {
          Map.set(x, y, cmd.data[x][y]);
        }
      }
    },

    set_players: function(cmd) {
      for (var playerId in cmd.data) {
        if (playerId != player.playerId) {
          //debugger;
          otherPlayers[playerId] = new Player(ctx, TILE);
          otherPlayers[playerId].playerId = playerId;
          otherPlayers[playerId].setPosition(cmd.data[playerId].x, cmd.data[playerId].y);
        }
      }
    },

    delete_player: function(cmd) {
      if (otherPlayers.hasOwnProperty(cmd.playerId)) {
        delete otherPlayers[cmd.playerId];
      }
    },
    
    talk: function(cmd) {
      if (otherPlayers.hasOwnProperty(cmd.playerId)) {
        otherPlayers[cmd.playerId].talk(cmd.message);
      }
    }
  }

  function dispatch(cmd) {
    player.playerId = player.playerId || socket.transport.sessionid;
    console.log('server sezz: ' + cmd);
    cmd = $.parseJSON(cmd);
    if(commands[cmd.name]) {
      commands[cmd.name](cmd);
    }
  }
    
  function tileIsOnScreen(tilePosition) {
    var screenPosition = tileToScreen(tilePosition);
    return pointIsOnScreen(screenPosition);
  }
  
  // convert a tile coordinate to our screen, relative to player
  // wraps
  function tileToScreen(tilePosition) {
    var tilePositionOffset = tilePosition.subtract(player.tilePosition);
    var screenPositionOffset = new Vector2D(tilePositionOffset.x * TILE.width, tilePositionOffset.y * TILE.height);
    var playerScreenOffset = new Vector2D(player.tileOffset.x * TILE.width, player.tileOffset.y * TILE.height);
    return playerScreenPosition.plus(screenPositionOffset).subtract(playerScreenOffset);
  }

  // convert a screen coordinate to our global tile system. 
  // wraps
  function screenToTile(screenPosition) {
    var playerScreenOffset = new Vector2D(player.tileOffset.x * TILE.width, player.tileOffset.y * TILE.height);
    var screenPositionOffset = screenPosition.subtract(playerScreenPosition).plus(playerScreenOffset);
    var tilePositionOffset = new Vector2D(screenPositionOffset.x / TILE.width, screenPositionOffset.y / TILE.height).floor();
    return player.tilePosition.plus(tilePositionOffset);
  }
  
  function tick(dt) {
    mouseTilePosition = screenToTile(mouseScreenPosition);
    player.tick(dt);
    for(var p in otherPlayers) {
      otherPlayers[p].tick(dt);
    }
    repaint(dt);
  }
  
  function drawTile(x, y, image) {
    var screenPos = tileToScreen(tilePos);
      ctx.drawImage(image, screenPos.x, screenPos.y);
  }
  
  function repaint(dt) {
    if(dt === undefined) dt = 0;
    // ctx.fillStyle = "rgb(255,255,255)";  
    ctx.clearRect(0,0,canvas.width(), canvas.height());  

    if(mouseTilePosition) {
      var mp = tileToScreen(mouseTilePosition);
      // mouseShadowSprite.positionOffset = {y: 45, x: 15};
      // mouseShadowSprite.draw(mp.x, mp.y);
      // ctx.strokeStyle = "rgb(205,197,193)";
      ctx.strokeStyle = "rgba(0,0,0,0.1)"
      ctx.lineWidth = 5;
      ctx.strokeRect(mp.x, mp.y, TILE.width, TILE.height);
    }
    
    if(player.destination) {
      var p = tileToScreen(player.destination); 
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      ctx.fillRect(p.x, p.y, TILE.width, TILE.height);
    }
  
    // this is super inefficient
    var spriteArray = [];
    for(var x in Map.tiles) {
      for(var y in Map.tiles[x]) {
        var tileType = Map.tiles[x][y];
        if(tileType) {
          var imageFile = "images/" + tileType + ".png"
          var sprite = tileSprites[imageFile];
          if(sprite && sprite.loaded) {
            var tilePos = new Vector2D(x, y);
            var screenPos = tileToScreen(tilePos);
            if(screenPos.isWithin(-TILE.width - 100, -TILE.height -500, canvas.width() + 200, canvas.height() + 500)) {
              spriteArray.push({"x": screenPos.x, "y": screenPos.y, "sprite": sprite})
            }
          }else{
            tileSprites[imageFile] = new Sprite(imageFile, ctx, null, null, TILE);
          }
        }
      }
    }
    spriteArray.push({"x": playerScreenPosition.x, "y": playerScreenPosition.y, "sprite": player.sprite})
    // console.log($.map(spriteArray, function(s) {
    //   return [s.y, s.sprite.image.src]
    // }));
    // console.log(spriteArray.length);

    for (var playerId in otherPlayers) {
      var otherPlayer = otherPlayers[playerId];
      var screenPos = tileToScreen(otherPlayer.position);
      spriteArray.push({x: screenPos.x, y: screenPos.y, sprite: otherPlayer.sprite});
    }

    spriteArray.sort(function(a,b) { return (a.y - b.y) || ((a.sprite.image.src === player.sprite.image.src) ? 1 : 0) || ((b.sprite.image.src === player.sprite.image.src) ? -1 : 0) || (a.x - b.x) });
    $.each(spriteArray, function() {
      this.sprite.draw(this.x, this.y)
    });
  }

  return {
    
    init: function() {
      canvas = $("canvas");
      ctx = canvas.get(0).getContext("2d");

      // Misc sprites
      // mouseShadowSprite = new Sprite("images/mouseShadow.png", ctx, null, null, TILE)

      // Set up socket
      io.setPath('/client/');
      var parts = window.location.host.split(":");
      socket = new io.Socket(parts[0], parts[1]);
      socket.connect();
      socket.on('message', dispatch);

      player = new Player(ctx, TILE);
      Watchmaker.player = player;

      // Dimensions
      var body = $("body");
      var w = $(window).width();
      var h = $(window).height();
      $(window).resize(function() {
        body.css('height', $(window).height() - 10)
        canvas.attr('width', $(body).width());
        canvas.attr('height', $(body).height() - 30);
        playerScreenPosition = new Vector2D(canvas.width() - TILE.width, canvas.height() - TILE.height).divideBy(2).floor();
        repaint()
      }).resize()
      
      // Setup event handlers
      canvas.mousemove(function(event) {
        mouseScreenPosition = new Vector2D(event.clientX,event.clientY);
      })
      canvas.click(function(event) {
        var screenPosition = new Vector2D(event.clientX,event.clientY);
        var p = screenToTile(screenPosition);
        socket.send(JSON.stringify({ 
          name: "move_req", 
          x1: player.tilePosition.x, 
          y1: player.tilePosition.y, 
          x2: p.x, 
          y2: p.y }))
      })
      
      // Draw loop
      var prevTime, dt, _tick;
      _tick = function() {
        // console.log("_tick")
        if(prevTime === undefined) {
          prevTime = new Date().getTime();
          dt = 0;
        }
        tick(dt);
        var newTime = new Date().getTime();
        dt = (newTime - prevTime);
        prevTime = newTime;
        var t = Math.max(FRAME_INTERVAL - dt, 0);
        //console.log(t)
        setTimeout(_tick, t)
      };
      _tick();
      
    },
    talk: function(message) {
      player.talk(message);
      socket.send(JSON.stringify({ 
        "name": "talk",
        "message": message,
        "playerId": player.playerId }))
    }
  }
}()

var Map = function() {
  var TILE_SIZE = 80;

  return {
    tiles: {},
    
    // get a thing at x and y
    get: function(x, y) {
      if(!this.tiles[x]) {
        return null;
      }else if(!this.tiles[x][y]) {
        return null;
      }else {
        return this.tiles[x][y];
      }
    },
    
    // set a thing at x and y
    set: function(x, y, value) {
      if(!this.tiles[x]) {
        this.tiles[x] = {};
      }
      if(!this.tiles[x][y]) {
        this.tiles[x][y] = {};
      }
      this.tiles[x][y] = value;
    },
    
    
    
    draw: function(ctx, x, y, w, h) {
      // for()
      // for(var i = 0; i < w; i++) {
      //   for(var j = 0; j < h; j++) {
      //     var tile = Map.get(i, j);
      //     if(tile) {
      //       imageFile = tile["type"] + ".png"
      //       var image = Images.loaded["images/" + imageFile];
      //       ctx.drawImage(image, i * TILE_SIZE, j * TILE_SIZE);
      //     }
      //   }
      // }
    }
    
  }
}();
