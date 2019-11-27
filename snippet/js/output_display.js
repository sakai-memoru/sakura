var output_display = function(str){
  if(debug_mode){
    Editor.TraceOut(str);
  } else {
    Editor.InsText(str);
  }
};

