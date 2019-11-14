function process(){
  
  Editor.GoFileEnd(0);
  Editor.InsText('\r\n');	// 文字入力
  Editor.InsText('## ');	// 文字入力
  Editor.InsertDate(0);	// 日付挿入
  Editor.InsertTime(0);	// 時刻挿入
  Editor.InsText(' :');	// 文字入力
  Editor.InsText('\r\n');	// 文字入力
  Editor.InsText('- \r\n');	// 文字入力
  Editor.Left(0);	// カーソル左移動
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
