
// --- VECTOR2D ------------------------------------------------------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Vector2D.random = function(x1, y1, x2, y2) {
  return new Vector2D(randomInt(x1, x2), randomInt(y1, y2));
}
Vector2D.prototype = {
  subtract: function(v2) {
    return new Vector2D(this.x - v2.x, this.y - v2.y);
  },
  plus: function(v2) {
    return new Vector2D(this.x + v2.x, this.y + v2.y);
  },
  floor: function() {
    return new Vector2D(Math.floor(this.x), Math.floor(this.y));
  },
  ceil: function() {
    return new Vector2D(Math.ceil(this.x), Math.ceil(this.y));
  },
  divideBy: function(value) {
    return new Vector2D(this.x / value, this.y / value);
  },
  multiplyBy: function(value) {
    return new Vector2D(this.x * value, this.y * value);
  },
  isWithin: function(minX, minY, maxX, maxY) {
    return(this.x >= minX && this.y >= minY && 
           this.x <= maxX && this.y <= maxY);
  },
  equals: function(v2) {
    return(this.x == v2.x && this.y == v2.y);
  }
}

if (typeof(exports) !== 'undefined') {
  exports.vector2D = Vector2D;
}
