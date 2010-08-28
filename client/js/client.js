// Viewport


//
// new Sprite({x; })

var Watchmaker = function() {

  var commands = {
    init: function(cmd) {
      console.log(cmd);
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
    if(commands[cmd.name]) {
      commands[cmd.name](cmd);
    }
  }

  return {
    
    init: function() {
      var images = ["images/gifter.png", "images/tile_blank.png"];
      Images.load(images, Watchmaker.main)
      io.setPath('/client/');
      socket = new io.Socket(window.location.host, window.location.port);
      socket.connect();
      socket.send('some data');
      socket.on('message', dispatch);
    },
  
    update: function(mapData) {
      
    },
  
    main: function() {
      




      var canvas = $("canvas");
      var body = $("body");
      var w = $(window).width();
      var h = $(window).height();
      $(window).resize(function() {
        body.css('height', $(window).height() - 10)
        canvas.attr('width', $(body).width());
        canvas.attr('height', $(body).height());
      }).resize()
      var ctx = canvas.get(0).getContext("2d");
      var s = new Sprite("images/gifter.png", ctx, 80, 9);
      var i = 0;
      setInterval(function() {
        i += 1;
        ctx.fillStyle = "rgb(255,255,255)";  
        ctx.fillRect (0,0,$(body).width(),$(body).height());  
        s.draw(50,50,2 + i % 2, 10)
      }, 500);
    }
  }
}()

var Sprite = function(source, ctx, frameWidth, numFrames) {
  // Load the image
	this.image = Images.loaded[source];
  this.ctx = ctx;
  this.frameWidth = frameWidth;
  this.numFrames = numFrames;
}

var Map = function() {
  var tiles = [];
    // 
    // function Region(x, y, width, height) {
    //   this.x = x;
    //   this.y = y;
    //   this.width = width;
    //   this.height = height;
    // }
    // $.extend(Region, {
    //   
    // })
    // 
  return {
    
    // get a thing at x and y
    get: function(x, y) {
      if(!tiles[x]) {
        return null;
      }else if(!tiles[x][y]) {
        return null;
      }else {
        return tiles[x][y];
      }
    },
    
    // set a thing at x and y
    set: function(x, y, value) {
      if(!tiles[x]) {
        tiles[x] = {};
      }
      if(!tiles[x][y]) {
        tiles[x][y] = {};
      }
      tiles[x][y] = value;
    }
    
    // // get a region starting at top left x, y, with width/height 
    // region: function(x, y, width, height) {
    //   
    // }
  }
}();

$.extend(Sprite.prototype, {
  draw: function(x, y, frame, scale) {
    this.ctx.drawImage(this.image, 
      this.frameWidth * frame, 0, this.frameWidth, this.image.height, // source
      x, y, this.frameWidth * 1, this.image.height * 1) // dest
  }
})


// not using right now
var Images = {
  load: function(sources, onAllLoaded) {
    var count = 0;
    $.each(sources, function() {
      var img = new Image();
      img.onload = function() {
        count += 1;
        if(count == sources.length) {
          onAllLoaded();
        }
      }
      img.src = this
      Images.loaded[this] = img;
    })
  },
  loaded: {}
}