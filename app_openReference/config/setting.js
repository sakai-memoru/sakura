// NOTICE:JSON記述が正しくないとevalでエラーとなり、CONFIGを読み込めない
var get_targetFolder = function(){
  var CONS_TARGET_REF = "reference\\www\\"
  var objShell = new ActiveXObject("WScript.Shell");
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var doc_folder = objShell.SpecialFolders("MyDocuments");
  var target_folder = objFS.BuildPath(doc_folder, CONS_TARGET_REF);
  objShell = null;
  objFS = null;
  return target_folder;
}

var CONFIG = {
  "DEBUG_MODE": false,
  "APP_NAME": "app_openReference.jse",
  "ENCODE" : "utf-8"
}
CONFIG.TARGET_FOLDER = get_targetFolder();
CONFIG.TARGET_PATH_WEBTECH = {
  "html" : "html/index.htm",
  "js" : "js/index2.htm",
  "css" : "css/index.htm",
  "jquery" : "js/jquery/index.htm",
  "bootstrap" : "bootstrap/index.html",
  "ex" : "ex/jstech.html"
}
CONFIG.TARGET_PATH_SCRIPT = {
  "python" : "python/index.html",
  "django" : "ex/django.html",
  "mongodb" : "ex/mongodb.html",
  "node.js" : "ex/nodejs.html",
  "vue.js" : "ex/vuejs.html"
}
CONFIG.TARGET_URL = {
  "google" : "http://www.google.com/", 
  "translate" : "https://translate.google.com/",
  "alc (logged in)" : "https://eowf.alc.co.jp/",
  "dictionary.com" : "https://www.dictionary.com/"
}
CONFIG.FAVORITES = {
  "favorites" : "edge://favorites/?id=2"
}

CONFIG.TARGET_PATH_SET = [
  CONFIG.TARGET_PATH_WEBTECH,
  CONFIG.TARGET_PATH_SCRIPT
]

//var ret = get_targetFolder();
//WScript.Echo(ret);
