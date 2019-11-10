/* JavaScript Outline  2010/4/27 ver 1.1 */
Outline.SetTitle( "JavaScriptアウトライン" );
Outline.SetListType( 100 );	//汎用ツリー
var line_max = Editor.GetLineCount( 0 );	//行数
var indent_unit = Editor.ChangeTabWidth( 0 );	//インデント幅（＝現在のタブ幅）
var tabSpace = "        ".substr(0, indent_unit);

var SECTION = "Outline";
var HIDE_PROPERTY = Plugin.GetOption(SECTION, "HideProperty") == 1 ? true : false;
var HIDE_ANONYMOUS = Plugin.GetOption(SECTION, "HideAnonymousFunc") == 1 ? true : false;

Array.prototype.peek = function() {
	return this.length == 0 ? null : this[this.length-1];
}

var extending = new Array();	//拡張中の要素名
function setExtending(level, target) {	//拡張中の要素を設定
	extending[level] = target;
	for (var i=level+1; i<extending.length; i++) {
		extending[i] = null;
	}
}
var in_comment = false;	//コメント中?
var in_paren_abbrev = false;	//ifやforの波括弧省略中?
var in_ternary_operator = false;	//三項演算子の?で終わる?
var in_ternary_operator2 = false;	//三項演算子の?の次?
var block_level = new Array();	//構文によるインデント
var in_level_down = false;	//階層下げ中
var down_level = 0;	//階層下げ閾レベル

//編集中文書を1行ずつ読み込んで解析する
for ( var line_no = 1; line_no <= line_max; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.replace(/[\r\n]+$/, "");	//EOLを取り除く

	// 行中コメント削除
	line_str = line_str.replace(/\/\*.*?\*\//g, "");
	line_str = line_str.replace(/\/\/.*$/g, "");
	if (/^\s*$/.test(line_str)) {
		continue;	//空行は飛ばす
	}
	//インデント取得、\t→スペース変換
	var indent = line_str.replace(/^(\s*).*$/, "$1");
	var column = indent.length+1;
	if (indent.length > 0) {
		indent = indent.replace(/\t/g, tabSpace);
		if (indent.length == 2) {
			indent_unit = 2;
		}
	}
	var indent_real  = indent.length/indent_unit;	//インデント数（タブ換算）
	while (block_level.length > 0 && indent_real <= block_level.peek()) block_level.pop();
	var indent_level = indent_real
					 - block_level.length			//ブロックインデント
					 - (in_paren_abbrev ? 1 : 0);	//ブロックインデント（波括弧省略）

	in_paren_abbrev = false;

	// 複数行コメントの処理
	if (/^\s*\/\*/.test(line_str)) {
		in_comment = true;
		if (/\*\/\s*$/.test(line_str)) {
			in_comment = false;
		}
		continue;
	}
	else if (/\*\/\s*$/.test(line_str)) {
		in_comment = false;
		continue;
	}
	else if (in_comment) {
		continue;
	}

	if (in_level_down) {
		if (indent_level <= down_level && ! /^\s*$/.test(line_str)) {
			in_level_down = false;
		} else {
			indent_level++;
		}
	}

	//三項演算子の ? で行が終わっているかどうか
	in_ternary_operator2 = in_ternary_operator;
	in_ternary_operator = /\?\s*$/.test(line_str);

	//構文インデントに対応
	if (/^\s*}?\s*\b(if|else|try|for|while|catch|finally)\b.*{\s*$/.test(line_str)) {
		block_level.push(indent_real);
		continue;
	}
	else if (/^\s*}?\s*\b(else|try|catch|finally)\b\s*$/.test(line_str)
		  || /^\s*}?\s*\b(if|else if|for|while|catch)\b.*\)\s*$/.test(line_str)) {
		in_paren_abbrev = true;
		continue;
	}
	else if (/^\s*}/.test(line_str)) {
		while (block_level.length > 0 && indent_real <= block_level.peek()) block_level.pop();
		continue;
	}

	// function xxxx の処理
	if (/^\s*function\b\s*[\w\$]*.*$/.test(line_str)) {
		var name = line_str.replace(/^\s*function\b\s*([\w\$]*).*$/, "$1");
		var arg = line_str.replace(/^\s*function\b\s*[\w\$]*\s*\(([^\)]*).*$/, "$1").replace(/^\s*/, " ").replace(/\s*$/, " ").replace(/\s*,\s*/g, ", ");
		if (name == "") {
			if (! HIDE_ANONYMOUS) {
				Outline.AddFuncInfo2( line_no, column, "無名(" + arg + ") 関数", indent_level );
			}
		} else {
			Outline.AddFuncInfo2( line_no, column, name + " (" + arg + ") 関数", indent_level );
			setExtending(0, null);
		}
//		TraceOut(name + " indent_level:" + indent_level + " block_level:" + block_level.peek() + " indent_real:" + indent_real);
	}
	// var xxxx = { の処理
	// xxxx = { の処理
	else if (/^\s*(var\s)?\s*(\b[\w\$.\[\] ]+\s*=\s*)+({\s*|\(\s*function\s*\(.*)$/.test(line_str)) {
		var name = line_str.replace(/^\s*(var\s)?\s*\b([\w\$.\[\] ]+)\s*=.*$/, "$2");
		name = name.replace(/\s+$/, "");
		Outline.AddFuncInfo2( line_no, column, name + " オブジェクト", indent_level );
		setExtending(indent_level, name);
	}
	// return { の処理
	else if (/^\s*return\s*{\s*$/.test(line_str)) {
		Outline.AddFuncInfo2( line_no, column, "戻り値", indent_level );
	}
	// xxxx : function() { の処理
	// xxxx = function() { の処理
	// var xxxx = function() { の処理
	else if (/^\s*(var\s)?\s*[\w$.]+\s*[:=]\s*function\s*([\w$]+\s*)?\([^\)]*/.test(line_str)) {
		var name = line_str.replace(/^\s*(var\s)?\s*([\w$.]+)\s*[:=].*$/, "$2");
		var arg = line_str.replace(/^.*function\s*([\w$]+\s*)?\(([^\)]*).*$/, "$2").replace(/^\s*/, " ").replace(/\s*$/, " ").replace(/\s*,\s*/g, ", ");
		var type = /=\s*function/.test(line_str) ? "関数" : "メソッド";
		var lastDot = name.lastIndexOf('.');
		if (in_ternary_operator2 && type == "メソッド") {
			//三項演算子の?の次に xxxx: があっても、それはメソッドじゃないよ
		} else if (lastDot < 0) {
			Outline.AddFuncInfo2( line_no, column, name + " (" + arg + ") " + type, indent_level );
			setExtending(indent_level, null);
		} else {
			var extend_target = name.substring(0, lastDot);
			if (extend_target != extending[indent_level]) {
				Outline.AddFuncInfo2( line_no, column, extend_target + " 拡張", indent_level );
				setExtending(indent_level, extend_target);
			}
			Outline.AddFuncInfo2( line_no, column, name.substring(lastDot+1) + " (" + arg + ") メソッド", indent_level+1 );
			setExtending(indent_level+1, name);
			down_level = indent_level;
			in_level_down = true;
		}
	}
	// xxxx : の処理
	else if (/^\s*case\s+[\w\$]+\s*:/.test(line_str)	//case
		  || /^\s*default\s*:/.test(line_str)			//default
		  || /^\s*[a-z]+:\/\//.test(line_str)			//URL
	) {
		//プロパティじゃない
	}
	else if (/^\s*['"]?[\w$.\-]+["']?\s*:/.test(line_str)) {
		//三項演算子の?の次に xxxx: があっても、それはプロパティじゃないよ
		if (! in_ternary_operator2) {
			var name = line_str.replace(/^\s*['"]?([\w$.\-]+)["']?\s*:.*$/, "$1");
			Outline.AddFuncInfo2( line_no, column, name + " プロパティ", indent_level );
		}
	}
	else if (/^\s*[\w$.]+\s*=(?!=)/.test(line_str)) {
		var name = line_str.replace(/^\s*([\w$.]+)\s*=.*$/, "$1");
		var lastDot = name.lastIndexOf('.');
		if (lastDot < 0) {
			//ただの変数代入なので追加しない
		} else if (HIDE_PROPERTY) {
			//
		} else {
			var extend_target = name.substring(0, lastDot);
			if (extend_target != extending[indent_level]) {
				Outline.AddFuncInfo2( line_no, column, extend_target + " 拡張", indent_level );
				setExtending(indent_level, extend_target);
			}
			Outline.AddFuncInfo2( line_no, column, name.substring(lastDot+1) + " プロパティ", indent_level+1 );
		}
	}
	// (function() { の処理
	else if (/^\s*;*\(\s*function\s*\([^\)]*\)\s*/.test(line_str)) {
		if (extending[0] != "ブロック") {
			Outline.AddFuncInfo2( line_no, column, "ブロック", indent_level );
			setExtending(indent_level, "ブロック");
		}
	}

	// for prototype.js
	// Object.extend の処理
	else if (/^\s*(var\s)?\s*[\w$.]+\s*=\s*Object\.extend\(/.test(line_str)) {
		var name = line_str.replace(/^.*\b([\w$.]+)\s*=.*$/, "$1");
		Outline.AddFuncInfo2( line_no, column, name + " オブジェクト", indent_level );
	}
	else if (/^\s*.*(Object\.)?extend\(\s*[\w$.]+\s*,/.test(line_str)) {
		var name = line_str.replace(/^\s*.*extend\(\s*([\w$.]+).*$/, "$1");
		if (name != extending[indent_level]) {
			Outline.AddFuncInfo2( line_no, column, name + " 拡張", indent_level );
			setExtending(indent_level, name);
		}
	}
	// Class.create の処理
	else if (/^\s*(var\s)?\s*[\w\$]+\s*=\s*Class\.create\s*\(/.test(line_str)) {
		var name = line_str.replace(/^.*\b([\w\$]+)\s*=.*$/, "$1");
		Outline.AddFuncInfo2( line_no, column, name + " クラス", indent_level );
		//Class.create配下の要素はインスタンスに付属するので、(クラス名).xxxとは区別する
		//setExtending(indent_level, name);
	}

	// for jQuery
	// jQuery.extend, jQuery.fn.extendの処理
	else if (/^\s*jQuery\.extend\(/.test(line_str)) {
		if (extending[0] != "jQuery") {
			Outline.AddFuncInfo2( line_no, column, "jQuery 拡張", 0 );
			setExtending(0, "jQuery");
		}
	}
	else if (/^\s*jQuery\.fn\.extend\(/.test(line_str)) {
		if (extending[0] != "jQuery.prototype") {
			Outline.AddFuncInfo2( line_no, column, "jQuery.prototype 拡張", 0 );
			setExtending(0, "jQuery.prototype");
		}
	}
	else if (/^\s*jQuery\.each\(.*[{\[]\s*$/.test(line_str)) {
		if (extending[0] != "jQuery.prototype") {
			Outline.AddFuncInfo2( line_no, column, "jQuery.each ブロック", indent_level );
			setExtending(indent_level, "ブロック");
		}
	}

	// for dojo
	// dojo.mixinの処理
	else if (/^\s*(dojo|d)\.mixin\(\s*[\w$.]+/.test(line_str)) {
		var extend_target = line_str.replace(/^.*\bmixin\(\s*([\w$.]+).*$/, "$1");
		if (extend_target != extending[indent_level]) {
			Outline.AddFuncInfo2( line_no, column, extend_target + " 拡張", indent_level );
			setExtending(indent_level, extend_target);
		}
	}
	else if (/^\s*(var\s)?\s*[\w$.]+\s*=\s*(dojo|d)\.mixin\(/.test(line_str)) {
		var target = line_str.replace(/^\s*(var\s)?\s*([\w$.]+)\s*=.*$/, "$2");
		Outline.AddFuncInfo2( line_no, column, target + " オブジェクト", indent_level );
		setExtending(indent_level, target);
	}

}

