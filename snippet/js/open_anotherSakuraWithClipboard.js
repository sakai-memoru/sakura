var open_anotherSakuraWithClipboard = function(str){
  if(debug_mode){
    Editor.TraceOut(str);
  } else {
    Editor.ClipboardEmpty();
    Editor.SetClipboard(0,str);
    var cmd_sakura_macro_path = get_sakuraMacroPath(CONFIG.MACRO_FILE_PASTE_CLIPBOARD, 'sakura');
    var cmd_statement_EXE_SAKURA = CONFIG.EXE_SAKURA_MACRO + cmd_sakura_macro_path;
    doBatch(cmd_statement_EXE_SAKURA);
  }
}

