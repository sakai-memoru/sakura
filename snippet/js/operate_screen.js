var operate_screen = function(str){
  if(debug_mode){
    Editor.TraceOut(str);
  } else {
    Editor.InsText(str);
  }
};

