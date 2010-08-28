
var DIRECTIONS = {
  "down": new Vector2D(0,1),
  "up": new Vector2D(0,-1),
  "left": new Vector2D(-1, 0),
  "right": new Vector2D(1, 0),
  "none": new Vector2D(0, 0)
}

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
      this.interval = interval
      this.elapsed = 0;
    },
    
    draw: function(x, y, dt) {
      this.elapsed += dt;
      var frameIndex = Math.floor(this.elapsed / this.interval) % this.frames.length;
      var frame = this.frames[frameIndex];
      this.ctx.drawImage(this.image, 
        this.frameWidth * frame, 0, this.frameWidth, this.image.height, // source
        x, y, this.frameWidth, this.image.height) // dest
    }
  })
  
  return SpriteClass;
}();

var Player = function(ctx, position) {
  this.sprite = new Sprite("images/gifter.png", ctx, 80, 9, {
    "walk_left": [0,1],
    "walk_right": [2,3],
    "stand_still": [4],
    "walk_down": [5,6],
    "walk_up": [7,8]
  })
  this.setPosition(0,0);
  this.destination = this.position;
  this.direction = DIRECTIONS.none;
  this.stop();
}
Player.SPEED = 1;
$.extend(Player.prototype, {
  tick: function(dt) {
    var change = this.direction.multiplyBy(0.001 * dt);
    var newPosition = this.position.plus(change);
    // console.log([change.x, change.y]);
    this.setPosition(newPosition.x, newPosition.y);
    // console.log(this.tilePosition.equals(this.destination))
    console.log(this.destination)
    if(this.tilePosition.equals(this.destination)) {
      this.stop();
    }
  },

  draw: function(screenPosition, dt) {
    this.sprite.draw(screenPosition.x, screenPosition.y, dt)
  },
  
  setPosition: function(x, y) {
    this.position = new Vector2D(x,y);
    this.tilePosition = this.position.floor();
    this.tileOffset = this.position.subtract(this.tilePosition);
  },
  
  walk: function(direction, destination) {
    this.sprite.setAnimation("walk_" + direction, 500);
    this.direction = DIRECTIONS[direction];
    this.destination = destination;
  },
  stop: function(direction) {
    this.sprite.setAnimation("stand_still", 1000);
    this.stopRequested = true;
    this.direction = DIRECTIONS.none;
  }
});