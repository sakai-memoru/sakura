﻿function process(){
  
  Editor.GoFileTop(0);
  Editor.InsText(Editor.GetClipboard(0));
  Editor.InsText("\r\n");
  Editor.GoFileTop(0);
  Editor.SelectAll();
}

// -------------- entry point
if(typeof(Editor) !== 'undefined'){
  process()
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('This script is for sakura macro.')
  } else {
    console.log('This script is for sakura macro.')
  }
}
