function createMap(data, key){
  var tiles = {};
  var start = null;
  function set(x, y, value) {
    if(!tiles[x]) {
      tiles[x] = {};
    }
    if(!tiles[x][y]) {
      tiles[x][y] = {};
    }
    tiles[x][y] = value;
  }
  var maxX = 0, 
      maxY = data.length;
  for(var y in data) {
    var row = data[y];
    maxX = Math.max(row.length, maxX);
    for(var x in row) {
      var c = row[x];
      var type = key[c];
      if(type) {
        if(type == "start") {
          start = {"x": x, "y": y}
        }else{
          set(x, y, type)
        }
      }
    }
  }
  return {
    "width": maxX,
    "height": maxY,
    "tiles": tiles,
    "start": start
  };
};

var MAP_KEY = {
  'p': "portopotty",
  '|': "streetlamp",
  'd': "desk",
  'A': "americanflag",
  "^": "deadtree",
  ":": "baretree",
  "h": "hachiko",
  "&": "livetree",
  "1": "banner",
  "*": "start"
}

MAP_DATA = [
"|                   ^      ::  :      ",
"         &                             :  ",
"                                    ",
"   &&       &   ^                    ",
"                         ^       h         ^  ",
"       &                                   ",
"|                      ^                       ^",
"                &                        ^",
"      &     A              ^         ^",
"                              ^     ",
"  &              ^&&                 ",
"                                     ",
"        &     d              ^       ",
"|                                    ",
"                          |     |     |    |   ",
"                                     ",
"            1    ^                   ",
 "            *                        ",
"      ^                              ",
"|                                    ",
"                                     ",
"                                     ",
"                                  :        ",
"                &                      : ",
"                                    :           ",
"                                     ",
"                                     ",
"      &         pppp           :       :      ",
"                                     ",
"                                     ",
"                                     ",
"                                     ",
"                     :                 ",
"                                         ",
"   :                                 ",
"                             :        ",
"                                     ",
"                                     ",
"| | | | | | | | | | | | | | | | | | | | | | | |"]


                                          
exports.map = createMap(MAP_DATA, MAP_KEY);



// var MAP_DATA = [
// "                                                                              ",
// "                           ~~~                                                ",
// "                         ~~~~                                                 ",
// "                       ~~~ ~                   ?                              ",
// "                      ~~   ~ ~                                                ",
// "                     ~~  ?   ~                                                ",
// "                     ~~~    ~~~~~~                              ?             ",
// "                     ~~~~   ~~~~~~~~~~~~~~                                    ",
// "                       ~~~ ~~~~~~~~~~~~~~~~~                                  ",
// "                       ~   ~~~~~~~~~~~~~~~~~                                  ",
// "                         ~~~~~~~~~~~~~~~~~~~                                  ",
// "                           ~~~~~~~~~~~~~~~~~                                  ",
// "                          ~~~~~~~~~~~~~~~~~~                                  ",
// "                           ~~~~~~~~~~~~~~~~                                   ",
// "                           ~~~~~~~~~~~~~~~~~                                  ",
// "                            ~~~~~~~~~~~  ~~                                   ",
// "                                         ~                                    ",
// "            ?                            ~                                    ",
// "                                        ~~                                    ",
// "                                        ~    ^                                ",
// "                                     D  ~~^                                   ",
// " ........ ........ ........ ........ D#~~~#                              ?    ",
// " ........ ........ ........ ........ D#####                                   ",
// "D........ ........ ........ ........ DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
// "D........ ........ ........ ........ D#####                                   ",
// " ........ ........ ........ ........ D#~~~#                                   ",
// " ........ ........ ........ ........ D ~~~                                    ",
// " ........ ........ ........ ........ D ~~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// " ........ ........ ........ ........ D    ~                                   ",
// "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD D  ~~~                                   ",
// " ........ ........ ........ ........ D  ~                                     ",
// " ........ ........ ........ ........ D#~~~#                              ?    ",
// " ........ ........ ........ ........ D#####                                   ",
// "D........ ........ ........ ........ DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
// "D........ ........ ........ ........ D#####                                   ",
// " ........ ........ ........ ........ D#~~~#                                   ",
// " ........ ........ ........ ........ D ~~~                                    ",
// " ........ ........ ........ ........ D ~~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// " ........ ........ ........ ........ D  ~~~                                   ",
// "                                       ~~~                                    ",
// "                                        ~~~                                   ",
// "                                       ~~~                                    ",
// "                                       ~~~                                    ",
// "                                        ~~~                                   ",
// "                                        ~D~                                   ",
// "                                        ~~~~                                  ",
// "                                      ~~~~ ~                                  ",
// "                                        ~~                                    ",
// "                                       ~~~                                    ",
// "                                       ~~                                     ",
// "                                       ~~                                     ",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^?^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
// "                                                                              ",
// "                                                                              ",
// "                                                                              "]
