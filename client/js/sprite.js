// --- Sprite -----------------------------------------------------------

var Sprite = function(source, ctx, frameWidth, numFrames) {
  // Load the image
	this.image = Images.loaded[source];
  this.ctx = ctx;
  this.frameWidth = frameWidth;
  this.numFrames = numFrames;
}
$.extend(Sprite.prototype, {
  draw: function(x, y, frame, scale) {
    this.ctx.drawImage(this.image, 
      this.frameWidth * frame, 0, this.frameWidth, this.image.height, // source
      x, y, this.frameWidth * 1, this.image.height * 1) // dest
  }
})