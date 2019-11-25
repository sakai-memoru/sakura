var open_dialog = function(text){
  if(typeof(text) === 'undefined') text = '';
  var message_ = 'Please input keywords.'
  var windowTitle = 'Input';
  var defaultText = text;
  var DIALOG = exports.DIALOG;
  var ret = text;
  if(flag == "sakura"){
    ret = Editor.inputBox(message_, defaultText, 30);
  }
  if(flag == "wsh"){
    ret = DIALOG.show_inputBox(message_, windowTitle, defaultText);
  }
  return ret;
}

