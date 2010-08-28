// Viewport


//
// new Sprite({x; })

var Watchmaker = function() {

  var TILE_SIZE = 80;
  var mouseTilePosition = new Vector2D(),
      playerScreenPosition = new Vector2D(),
      playerTilePosition = new Vector2D(64,64);
      
  // Drawing
  var canvas, ctx;

  // Sprite
  var player;
  

  var IMAGES = ["images/gifter.png", 
                "images/blank.png",
                "images/grass.png",
                "images/water.png",
                "images/tile_blank.png"];

  var commands = {
    init: function(cmd) {
      playerTilePosition = new Vector2D(cmd.x, cmd.y);
    },
    move: function(cmd) {
      console.log(cmd);
    },
    interact: function(cmd) {
      console.log(cmd);
    }
  }

  function dispatch(cmd) {
    console.log('server sezz: ' + cmd);
    cmd = JSON.parse(cmd);
    if(commands[cmd.name]) {
      commands[cmd.name](cmd);
    }
  }
  
  // convert a tile coordinate to our screen
  // wraps
  function tileToScreen(tilePosition) {
    var tilePositionOffset = tilePosition.subtract(playerTilePosition);
    return playerScreenPosition.plus(tilePositionOffset.multiplyBy(TILE_SIZE));
  }

  // convert a screen coordinate to our global tile system. 
  // wraps
  function screenToTile(screenPosition) {
    var screenPositionOffset = screenPosition.subtract(playerScreenPosition);
    var tilePositionOffset = screenPositionOffset.divideBy(TILE_SIZE).floor();
    return playerTilePosition.plus(tilePositionOffset);
  }
  
  // function getTilePosition(event) {
  //   // var screenPositionOffset = screenPosition.subtract(playerScreenPosition);
  //   // var tilePositionOffset = screenPositionOffset.divideBy(TILE_SIZE).floor();
  //   // return playerTilePosition.plus(tilePositionOffset);
  // }
  
  function repaint() {
    ctx.fillStyle = "rgb(245,245,245)";  
    ctx.fillRect (0,0,canvas.width(), canvas.height());  
    player.draw(playerScreenPosition.x, playerScreenPosition.y ,4, 10)
  }

  return {
    
    init: function() {

      Images.load(IMAGES, Watchmaker.main)

      // set up socket
      io.setPath('/client/');
      var parts = window.location.host.split(":");
      socket = new io.Socket(parts[0], parts[1]);
      socket.connect();
      socket.on('message', dispatch);
      
      // set up 
      canvas = $("canvas");
      ctx = canvas.get(0).getContext("2d");      
    },
  
    main: function() {
      player = new Sprite("images/gifter.png", ctx, 80, 9);
      var body = $("body");
      var w = $(window).width();
      var h = $(window).height();
      $(window).resize(function() {
        body.css('height', $(window).height() - 10)
        canvas.attr('width', $(body).width());
        canvas.attr('height', $(body).height());
        playerScreenPosition = new Vector2D($(body).width() - TILE_SIZE, $(body).height() - TILE_SIZE).divideBy(2).floor();
        repaint()
      }).resize()
      
      canvas.mousemove(function(event) {
        var screenPosition = new Vector2D(event.clientX,event.clientY);
        var p = screenToTile(screenPosition);
        var t = tileToScreen(p);
        console.log([p.x, p.y, t.x, t.y]);
      })
      canvas.click(function(event) {
        var screenPosition = new Vector2D(event.clientX,event.clientY);
        var p = screenToTile(screenPosition);
        console.log([p.x, p.y]);        
      })
    }
  }
}()



// UNUSED
// 
// var Map = function() {
//   var tiles = {};
//   var TILE_SIZE = 80;
//     // 
//     // function Region(x, y, width, height) {
//     //   this.x = x;
//     //   this.y = y;
//     //   this.width = width;
//     //   this.height = height;
//     // }
//     // $.extend(Region, {
//     //   
//     // })
//     // 
//   return {
//     
//     // get a thing at x and y
//     get: function(x, y) {
//       if(!tiles[x]) {
//         return null;
//       }else if(!tiles[x][y]) {
//         return null;
//       }else {
//         return tiles[x][y];
//       }
//     },
//     
//     // set a thing at x and y
//     set: function(x, y, value) {
//       if(!tiles[x]) {
//         tiles[x] = {};
//       }
//       if(!tiles[x][y]) {
//         tiles[x][y] = {};
//       }
//       tiles[x][y] = value;
//     },
//     
//     draw: function(ctx, x, y, w, h) {
//       for(var i = 0; i < w; i++) {
//         for(var j = 0; j < h; j++) {
//           var imageFile = "blank.png";
//           var tile = Map.get(i, j);
//           debugger;
//           if(tile) {
//             imageFile = tile["type"] + ".png"
//           }
//           var image = Images.loaded["images/" + imageFile];
//           ctx.drawImage(image, i * TILE_SIZE, j * TILE_SIZE);
//         }
//       }
//     }
//     
//     // // get a region starting at top left x, y, with width/height 
//     // region: function(x, y, width, height) {
//     //   
//     // }
//   }
// }();
