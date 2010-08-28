// Viewport


//
// new Sprite({x; })

var Watchmaker = {
  init: function(images) {
    Images.load(images, Watchmaker.run)
  },
  
  run: function() {
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
      s.draw(50,50,7 + i % 2, 10)
    }, 500);
  }
}

var Sprite = function(source, ctx, frameWidth, numFrames) {
  // Load the image
	this.image = Images.loaded[source];
  this.ctx = ctx;
  this.frameWidth = frameWidth;
  this.numFrames = numFrames;
}

var Map = function() {
  this.tiles = [];
}

$.extend(Sprite.prototype, {
  draw: function(x, y, frame, scale) {
    this.ctx.drawImage(this.image, 
      this.frameWidth * frame, 0, this.frameWidth, this.image.height, // source
      x, y, this.frameWidth * 1, this.image.height * 1) // dest
  }
})

var Tile = function() {
  
}


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