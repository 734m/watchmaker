// Viewport


//
// new Sprite({x; })

var Watchmaker = function() {

  // Dimensions
  var TILE_SIZE = 80;
  var mouseTilePosition = new Vector2D(),
      playerScreenPosition = new Vector2D();
  
  // Drawing
  var FRAME_RATE = 20;
  var FRAME_INTERVAL = 1000 / FRAME_RATE;
  var canvas, ctx;

  // Sprites
  var player;
  
  // Socket
  var socket;
  
  var IMAGES = ["images/gifter.png", 
                "images/blank.png",
                "images/grass.png",
                "images/water.png",
                "images/crater.png",
                "images/tile_blank.png"];

  var commands = {
    init: function(cmd) {
      player.setPosition(cmd.x, cmd.y)
      repaint();
    },

    move: function(cmd) {
      player.walk(cmd.direction, new Vector2D(cmd.x2, cmd.y2));
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
      repaint();
    },

    set_players: function(cmd) {
      console.log(cmd);
    }
  }

  function dispatch(cmd) {
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
  
  // convert a tile coordinate to our screen
  // wraps
  function tileToScreen(tilePosition) {
    var tilePositionOffset = tilePosition.subtract(player.tilePosition);
    return playerScreenPosition.plus(tilePositionOffset.multiplyBy(TILE_SIZE)).subtract(player.tileOffset.multiplyBy(TILE_SIZE));
  }

  // convert a screen coordinate to our global tile system. 
  // wraps
  function screenToTile(screenPosition) {
    var screenPositionOffset = screenPosition.subtract(playerScreenPosition);
    var tilePositionOffset = screenPositionOffset.divideBy(TILE_SIZE).floor();
    return player.tilePosition.plus(tilePositionOffset);
  }
  
  // function getTilePosition(event) {
  //   // var screenPositionOffset = screenPosition.subtract(playerScreenPosition);
  //   // var tilePositionOffset = screenPositionOffset.divideBy(TILE_SIZE).floor();
  //   // return player.tilePosition.plus(tilePositionOffset);
  // }
  
  function tick(dt) {
    player.tick(dt);
    repaint(dt);
  }
  
  function repaint(dt) {
    if(dt === undefined) dt = 0;
    ctx.fillStyle = "rgb(245,245,245)";  
    ctx.fillRect (0,0,canvas.width(), canvas.height());  
    var mp = tileToScreen(mouseTilePosition);
    ctx.fillStyle = "rgb(210,210,210)";
    ctx.fillRect(mp.x, mp.y, TILE_SIZE, TILE_SIZE);
  
    // this is super inefficient
    for(var x in Map.tiles) {
      for(var y in Map.tiles[x]) {
        var tilePos = new Vector2D(x, y);
        var screenPos = tileToScreen(tilePos);
        if(screenPos.isWithin(-TILE_SIZE, -TILE_SIZE, canvas.width(), canvas.height())) {
          var tileData = Map.tiles[x][y];
          var imageFile = "images/" + tileData["type"] + ".png"
          var image = Images.loaded[imageFile];
          ctx.drawImage(image, screenPos.x, screenPos.y);
        }
      }
    }
    player.draw(playerScreenPosition, dt);
  }

  return {
    
    init: function() {

      Images.load(IMAGES, Watchmaker.main)
      // set up 
      canvas = $("canvas");
      ctx = canvas.get(0).getContext("2d");      
    },
  
    main: function() {
      player = new Player(ctx);
      // player = new Sprite("images/gifter.png", ctx, 80, 9);
      var body = $("body");
      var w = $(window).width();
      var h = $(window).height();
      $(window).resize(function() {
        body.css('height', $(window).height() - 10)
        canvas.attr('width', $(body).width());
        canvas.attr('height', $(body).height() - 30);
        playerScreenPosition = new Vector2D(canvas.width() - TILE_SIZE, canvas.height() - TILE_SIZE).divideBy(2).floor();
        repaint()
      }).resize()
      
      // Setup event handlers
      canvas.mousemove(function(event) {
        var screenPosition = new Vector2D(event.clientX,event.clientY);
        mouseTilePosition = screenToTile(screenPosition);
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
        // console.log(dt);
        prevTime = newTime;
        setTimeout(_tick, FRAME_INTERVAL - dt)
      };
      _tick();
      
      // set up socket
      io.setPath('/client/');
      var parts = window.location.host.split(":");
      socket = new io.Socket(parts[0], parts[1]);
      socket.connect();
      socket.on('message', dispatch);
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
