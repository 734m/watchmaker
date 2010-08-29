// --- Image Preloading -------------------------------------------------

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

// via http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
