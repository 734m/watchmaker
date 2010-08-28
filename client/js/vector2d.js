
// --- VECTOR2D ------------------------------------------------------------

var Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
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
  divideBy: function(value) {
    return new Vector2D(this.x / value, this.y / value);
  },
  multiplyBy: function(value) {
    return new Vector2D(this.x * value, this.y * value);
  }
}

if (typeof(exports) !== 'undefined') {
  exports.vector2D = Vector2D;
}
