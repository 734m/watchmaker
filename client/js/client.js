//
// new Sprite({x; })


var Sprite = function(opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.width = opts.width;
  this.height = opts.height;

  // Load the image
	this.image = new Image();
  var s = this;
	this.image.onload = function() {
	  s.ready = true;
	}
	this.image.src = opts.src;
	this.frames = opts.frames;
}
$.extend(Sprite.prototype, {
  
  
})