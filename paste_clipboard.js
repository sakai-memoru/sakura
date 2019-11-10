function process(){
  Editor.Paste(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.UP(0);
  Editor.Right(0);
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
