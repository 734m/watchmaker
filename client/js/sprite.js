
var DIRECTIONS = {
  "down": new Vector2D(0,1),
  "up": new Vector2D(0,-1),
  "left": new Vector2D(-1, 0),
  "right": new Vector2D(1, 0),
  "none": new Vector2D(0, 0)
}

// --- Sprite -----------------------------------------------------------

var Sprite = function() {
  
  var SpriteClass = function(source, ctx, frameWidth, numFrames, tileDimensions, animations, afterDraw) {
    var s = this;
    this.image = new Image();
    this.image.onload = function() {
      s.loaded = true;
      if(!s.frameWidth) {
        s.frameWidth = s.image.width;
      }
      s.positionOffset = {y: 35, x: (s.frameWidth - tileDimensions.width) / 2};
    }
    this.image.src = source;
    this.ctx = ctx;
    this.frameWidth = frameWidth;
    this.numFrames = numFrames || 1;
    this.animations = animations || {"default": [0]};
    this.frames = [];
    this.afterDraw = afterDraw;
    SpriteClass.SPRITES[source] = this;
    this.setAnimation("default", 100000);
  }
  SpriteClass.SPRITES = {};
  
  $.extend(SpriteClass.prototype, {
    setAnimation: function(name, interval) {
      this.frames = this.animations[name] || [0];
      this.interval = interval
      this.elapsed = 0;
    },
    
    tick: function(dt) {
      this.elapsed += dt;
    },
    
    draw: function(x, y) {
      if(!this.loaded) {
        return;
      }
      if(this.frames.length == 0) {
        var frameIndex = 0;
      }else{
        var frameIndex = Math.floor(this.elapsed / this.interval) % this.frames.length;
      }
      var frame = this.frames[frameIndex];
      this.ctx.drawImage(this.image, 
        this.frameWidth * frame, 0, 
        this.frameWidth, 
        this.image.height, // source
        x - this.positionOffset.x, 
        y - (this.image.height - this.positionOffset.y), 
        this.frameWidth, 
        this.image.height) // dest
      if(this.afterDraw) {
        this.afterDraw(x, y);
      }
    }
  })
  
  return SpriteClass;
}();

var Player = function(ctx, tileSize, position) {
  this.sprite = new Sprite("images/gifter.png", ctx, 80, 9, tileSize, {
    "walk_left": [0,1],
    "walk_right": [2,3],
    "default": [4],
    "walk_down": [5,6],
    "walk_up": [7,8]
  }, this.afterDraw);
  this.chatBubbleSprite = new Sprite("images/talkbubble.png", ctx, 42*5, 3, tileSize, {
    "default": [0,1,2]
  })
  this.chatBubbleSprite.setAnimation("default", 100);
  this.chatBubbleText = $("<div></div>").addClass("chatBubbleText").appendTo("body");
  this.setPosition(0,0);
  this.destination = this.position;
  this.direction = DIRECTIONS.none;
  this.stop();
}
Player.HSPEED = 2;
Player.VSPEED = 3;
Player.CHAT_BUBBLE_TIMEOUT = 10000;
$.extend(Player.prototype, {
  tick: function(dt) {
    this.sprite.tick(dt);
    this.chatBubbleSprite.tick(dt);
    if(this.directionName != "stop") {
      var change = this.direction.multiplyBy(0.001 * dt);
      var newPosition = this.position.plus(new Vector2D(change.x * Player.HSPEED, change.y * Player.VSPEED));

      // cases:
      //
      // 1. walking
      //   a. left
      //     i.  found destination x, start walking up/down
      //     ii. didn't find destination x, keep walking
      //   b. right
      //     i.  found destination x, start walking up/down
      //     ii. didn't find destination x, keep walking
      //   c. up
      //     i.  found destination y, start walking left/right
      //     ii. didn't find destination y, keep walking
      //   d. down
      //     i.  found destination y, start walking left/right
      //     ii. didn't find destination y, keep walking
      //
      // 2. stop if at destination, snapping to tile
      //

      // case 1
      // a. walking left
      if (this.directionName == 'left') {

        // found destination x
        if (newPosition.x < this.destination.x) {

          // snap
          this.setPosition(this.destination.x, newPosition.y);

          // now, figure out if i should start walking up or down
          var direction;
          if (this.position.y > this.destination.y) {
            direction = "up";
          } else if (this.position.y < this.destination.y) {
            direction = "down";
          } else {
            direction = "stop";
          }

          this.walk(direction, this.destination);
        }

        // didn't find destination x, yet
        else {
          this.setPosition(newPosition.x, newPosition.y);
        }
      }

      // b. walking right
      else
      if (this.directionName == 'right') {

        // found destination x
        if (newPosition.x > this.destination.x) {

          // snap
          this.setPosition(this.destination.x, newPosition.y);

          // now, figure out if i should start walking up or down
          var direction;
          if (this.position.y > this.destination.y) {
            direction = "up";
          } else if (this.position.y < this.destination.y) {
            direction = "down";
          } else {
            direction = "stop";
          }

          this.walk(direction, this.destination);
        }

        // didn't find destination x, yet
        else {
          this.setPosition(newPosition.x, newPosition.y);
        }
      }

      // c. walking up
      else
      if (this.directionName == 'up') {

        // found destination y
        if(newPosition.y < this.destination.y) {

          // snap
          this.setPosition(newPosition.x, this.destination.y);

          // now, figure out if i should start walking left or right
          var direction;
          if (this.position.x > this.destination.x) {
            direction = "left";
          } else if (this.position.x < this.destination.x) {
            direction = "right";
          } else {
            direction = "stop";
          }

          this.walk(direction, this.destination);
        }

        // didn't find destination y, yet
        else {
          this.setPosition(newPosition.x, newPosition.y);
        }
      }

      // d. walking down
      else
      if (this.directionName == 'down') {

        // found destination y
        if(newPosition.y > this.destination.y) {

          // snap
          this.setPosition(newPosition.x, this.destination.y);

          // now, figure out if i should start walking left or right
          var direction;
          if (this.position.x > this.destination.x) {
            direction = "left";
          } else if (this.position.x < this.destination.x) {
            direction = "right";
          } else {
            direction = "stop";
          }

          this.walk(direction, this.destination);
        }

        // didn't find destination y, yet
        else {
          this.setPosition(newPosition.x, newPosition.y);
        }
      }

      // case 2
      if (this.position.equals(this.destination)) {
        this.stop();
      }

    }
  },

  setPosition: function(x, y) {
    this.position = new Vector2D(x,y);
    this.tilePosition = this.position.floor();
    this.tileOffset = this.position.subtract(this.tilePosition);
  },
  
  walk: function(directionName, destination) {
    if(directionName == "stop") {
      this.stop();
    }else{
      // debugger;
      this.sprite.setAnimation("walk_" + directionName, 150);
      this.directionName = directionName;
      this.direction = DIRECTIONS[directionName];
      this.destination = destination;
    }
  },
  
  stop: function() {
    this.directionName = "stop"
    this.setPosition(this.tilePosition.x, this.tilePosition.y);
    this.sprite.setAnimation("default", 1000);
    this.stopRequested = true;
    this.direction = DIRECTIONS.none;
  },
  
  drawChatBubble: function(x, y) {
    if(this.message != null) {
      this.chatBubbleSprite.draw(x + 80, y - 80);
    }
    this.chatBubbleText.css({top: y - 120, left: x + 35}).text(this.message).show();
  },
  
  removeChatBubble: function(player) {
    player.sprite.afterDraw = null;
    player.chatBubbleText.hide();
  },
  
  talk: function(message) {
    var p = this;
    clearTimeout(this.chatBubbleTimeoutID);
    this.message = message;
    this.sprite.afterDraw = function(x,y) {
      p.drawChatBubble(x, y)
    }
    this.chatBubbleTimeoutID = setTimeout(this.removeChatBubble, Player.CHAT_BUBBLE_TIMEOUT, this);
  }
});

