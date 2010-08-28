/*
.* This code searches for all the <script type="application/processing" src="sourcefile#canvasid">
.* in your page and loads each script in the target canvas with the proper id.
.* It is useful to smooth the process of adding Processing code in your page and starting
.* the Processing.js engine.
.* This supports all four main variants of the script tag's src attribute:
.* no src, src="#canvasid", src="sourcefile" and src="sourcefile#canvasid"
.* where the first two have inline source and the others have an external file,
.* and the two with #canvasid use the canvas with the given id while the others
.* use the first canvas after the script block.
 */

if ( window.addEventListener ) {
	window.addEventListener("load", function() {
		var scripts = document.getElementsByTagName("script");

		for ( var i = 0; i < scripts.length; i++ ) {
			if ( scripts[i].type == "application/processing" ) {
				var src = scripts[i].src, canvas = scripts[i].nextSibling;

				if ( src && src.indexOf("#") >= 0 ) {
					canvas = document.getElementById( src.substr( src.indexOf("#") + 1 ) );
					src = src.substr(0, src.indexOf("#"));
				} else {
					while ( canvas && canvas.nodeName.toUpperCase() != "CANVAS" )
						canvas = canvas.nextSibling;
				}

				if ( canvas ) {
					var p = null;
					if ( src && src != document.location.href ) {
						p = Processing(canvas, false);
						p.init( p.ajax(src) );
					} else {
						p = Processing(canvas, scripts[i].text);
					}
					if ( p ) {
						canvas.Processing = p;
					}
				}
			}
		}
	}, false);
}