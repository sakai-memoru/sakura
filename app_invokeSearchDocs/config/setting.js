// NOTICE:JSON記述が正しくないとevalでエラーとなり、CONFIGを読み込めない
var get_documentFolder = function(){
  var objShell = new ActiveXObject("WScript.Shell");
  var doc_folder = objShell.SpecialFolders("MyDocuments");
  objShell = null;
  return doc_folder;
}

var CONFIG = {
  "DEBUG_MODE": false,
  "APP_NAME": "app_invokeSearchDocs.jse",
  "TARGET_FOLDER": get_documentFolder(),
  "TARGET_EXT": ['pptx', 'xlsx', 'md', 'pdf', 'asta'],
  "ENCODE" : "utf-8"
}
