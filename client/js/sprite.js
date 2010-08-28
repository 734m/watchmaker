// --- Sprite -----------------------------------------------------------

var Sprite = function() {
  
  var SpriteClass = function(source, ctx, frameWidth, numFrames, animations) {
    // Load the image
  	this.image = Images.loaded[source];
    this.ctx = ctx;
    this.frameWidth = frameWidth;
    this.numFrames = numFrames;
    this.animations = animations;
    this.frames = [];
  }
  
  $.extend(SpriteClass.prototype, {
    setAnimation: function(name, interval) {
      this.frames = this.animations[name];
      console.log([name, this.frames, interval])
      this.interval = interval
      this.elapsed = 0;
    },
    
    draw: function(x, y, dt) {
      this.elapsed += dt;
      var frameIndex = Math.floor(this.elapsed / this.interval) % this.frames.length;
      console.log([this.elapsed, this.interval, Math.floor(this.elapsed / this.interval), frameIndex]);
      var frame = this.frames[frameIndex];
      this.ctx.drawImage(this.image, 
        this.frameWidth * frame, 0, this.frameWidth, this.image.height, // source
        x, y, this.frameWidth, this.image.height) // dest
    }
  })
  
  return SpriteClass;
}();

var Player = function(ctx) {
  this.sprite = new Sprite("images/gifter.png", ctx, 80, 9, {
    "walk_left": [0,1],
    "walk_right": [2,3],
    "stand_still": [4],
    "walk_down": [5,6],
    "walk_up": [7,8]
  })
  this.stop();
}
$.extend(Player.prototype, {
  walk: function(direction) {
    this.sprite.setAnimation("walk_" + direction, 500);
  },
  stop: function(direction) {
    this.sprite.setAnimation("stand_still", 1000);
  }
});