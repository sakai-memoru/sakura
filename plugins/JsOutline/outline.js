/* JavaScript Outline  2010/4/27 ver 1.1 */
Outline.SetTitle( "JavaScript�A�E�g���C��" );
Outline.SetListType( 100 );	//�ėp�c���[
var line_max = Editor.GetLineCount( 0 );	//�s��
var indent_unit = Editor.ChangeTabWidth( 0 );	//�C���f���g���i�����݂̃^�u���j
var tabSpace = "        ".substr(0, indent_unit);

var SECTION = "Outline";
var HIDE_PROPERTY = Plugin.GetOption(SECTION, "HideProperty") == 1 ? true : false;
var HIDE_ANONYMOUS = Plugin.GetOption(SECTION, "HideAnonymousFunc") == 1 ? true : false;

Array.prototype.peek = function() {
	return this.length == 0 ? null : this[this.length-1];
}

var extending = new Array();	//�g�����̗v�f��
function setExtending(level, target) {	//�g�����̗v�f��ݒ�
	extending[level] = target;
	for (var i=level+1; i<extending.length; i++) {
		extending[i] = null;
	}
}
var in_comment = false;	//�R�����g��?
var in_paren_abbrev = false;	//if��for�̔g���ʏȗ���?
var in_ternary_operator = false;	//�O�����Z�q��?�ŏI���?
var in_ternary_operator2 = false;	//�O�����Z�q��?�̎�?
var block_level = new Array();	//�\���ɂ��C���f���g
var in_level_down = false;	//�K�w������
var down_level = 0;	//�K�w����臃��x��

//�ҏW��������1�s���ǂݍ���ŉ�͂���
for ( var line_no = 1; line_no <= line_max; line_no++ ) {
	var line_str = Editor.GetLineStr( line_no );
	line_str = line_str.replace(/[\r\n]+$/, "");	//EOL����菜��

	// �s���R�����g�폜
	line_str = line_str.replace(/\/\*.*?\*\//g, "");
	line_str = line_str.replace(/\/\/.*$/g, "");
	if (/^\s*$/.test(line_str)) {
		continue;	//��s�͔�΂�
	}
	//�C���f���g�擾�A\t���X�y�[�X�ϊ�
	var indent = line_str.replace(/^(\s*).*$/, "$1");
	var column = indent.length+1;
	if (indent.length > 0) {
		indent = indent.replace(/\t/g, tabSpace);
		if (indent.length == 2) {
			indent_unit = 2;
		}
	}
	var indent_real  = indent.length/indent_unit;	//�C���f���g���i�^�u���Z�j
	while (block_level.length > 0 && indent_real <= block_level.peek()) block_level.pop();
	var indent_level = indent_real
					 - block_level.length			//�u���b�N�C���f���g
					 - (in_paren_abbrev ? 1 : 0);	//�u���b�N�C���f���g�i�g���ʏȗ��j

	in_paren_abbrev = false;

	// �����s�R�����g�̏���
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

	//�O�����Z�q�� ? �ōs���I����Ă��邩�ǂ���
	in_ternary_operator2 = in_ternary_operator;
	in_ternary_operator = /\?\s*$/.test(line_str);

	//�\���C���f���g�ɑΉ�
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

	// function xxxx �̏���
	if (/^\s*function\b\s*[\w\$]*.*$/.test(line_str)) {
		var name = line_str.replace(/^\s*function\b\s*([\w\$]*).*$/, "$1");
		var arg = line_str.replace(/^\s*function\b\s*[\w\$]*\s*\(([^\)]*).*$/, "$1").replace(/^\s*/, " ").replace(/\s*$/, " ").replace(/\s*,\s*/g, ", ");
		if (name == "") {
			if (! HIDE_ANONYMOUS) {
				Outline.AddFuncInfo2( line_no, column, "����(" + arg + ") �֐�", indent_level );
			}
		} else {
			Outline.AddFuncInfo2( line_no, column, name + " (" + arg + ") �֐�", indent_level );
			setExtending(0, null);
		}
//		TraceOut(name + " indent_level:" + indent_level + " block_level:" + block_level.peek() + " indent_real:" + indent_real);
	}
	// var xxxx = { �̏���
	// xxxx = { �̏���
	else if (/^\s*(var\s)?\s*(\b[\w\$.\[\] ]+\s*=\s*)+({\s*|\(\s*function\s*\(.*)$/.test(line_str)) {
		var name = line_str.replace(/^\s*(var\s)?\s*\b([\w\$.\[\] ]+)\s*=.*$/, "$2");
		name = name.replace(/\s+$/, "");
		Outline.AddFuncInfo2( line_no, column, name + " �I�u�W�F�N�g", indent_level );
		setExtending(indent_level, name);
	}
	// return { �̏���
	else if (/^\s*return\s*{\s*$/.test(line_str)) {
		Outline.AddFuncInfo2( line_no, column, "�߂�l", indent_level );
	}
	// xxxx : function() { �̏���
	// xxxx = function() { �̏���
	// var xxxx = function() { �̏���
	else if (/^\s*(var\s)?\s*[\w$.]+\s*[:=]\s*function\s*([\w$]+\s*)?\([^\)]*/.test(line_str)) {
		var name = line_str.replace(/^\s*(var\s)?\s*([\w$.]+)\s*[:=].*$/, "$2");
		var arg = line_str.replace(/^.*function\s*([\w$]+\s*)?\(([^\)]*).*$/, "$2").replace(/^\s*/, " ").replace(/\s*$/, " ").replace(/\s*,\s*/g, ", ");
		var type = /=\s*function/.test(line_str) ? "�֐�" : "���\�b�h";
		var lastDot = name.lastIndexOf('.');
		if (in_ternary_operator2 && type == "���\�b�h") {
			//�O�����Z�q��?�̎��� xxxx: �������Ă��A����̓��\�b�h����Ȃ���
		} else if (lastDot < 0) {
			Outline.AddFuncInfo2( line_no, column, name + " (" + arg + ") " + type, indent_level );
			setExtending(indent_level, null);
		} else {
			var extend_target = name.substring(0, lastDot);
			if (extend_target != extending[indent_level]) {
				Outline.AddFuncInfo2( line_no, column, extend_target + " �g��", indent_level );
				setExtending(indent_level, extend_target);
			}
			Outline.AddFuncInfo2( line_no, column, name.substring(lastDot+1) + " (" + arg + ") ���\�b�h", indent_level+1 );
			setExtending(indent_level+1, name);
			down_level = indent_level;
			in_level_down = true;
		}
	}
	// xxxx : �̏���
	else if (/^\s*case\s+[\w\$]+\s*:/.test(line_str)	//case
		  || /^\s*default\s*:/.test(line_str)			//default
		  || /^\s*[a-z]+:\/\//.test(line_str)			//URL
	) {
		//�v���p�e�B����Ȃ�
	}
	else if (/^\s*['"]?[\w$.\-]+["']?\s*:/.test(line_str)) {
		//�O�����Z�q��?�̎��� xxxx: �������Ă��A����̓v���p�e�B����Ȃ���
		if (! in_ternary_operator2) {
			var name = line_str.replace(/^\s*['"]?([\w$.\-]+)["']?\s*:.*$/, "$1");
			Outline.AddFuncInfo2( line_no, column, name + " �v���p�e�B", indent_level );
		}
	}
	else if (/^\s*[\w$.]+\s*=(?!=)/.test(line_str)) {
		var name = line_str.replace(/^\s*([\w$.]+)\s*=.*$/, "$1");
		var lastDot = name.lastIndexOf('.');
		if (lastDot < 0) {
			//�����̕ϐ�����Ȃ̂Œǉ����Ȃ�
		} else if (HIDE_PROPERTY) {
			//
		} else {
			var extend_target = name.substring(0, lastDot);
			if (extend_target != extending[indent_level]) {
				Outline.AddFuncInfo2( line_no, column, extend_target + " �g��", indent_level );
				setExtending(indent_level, extend_target);
			}
			Outline.AddFuncInfo2( line_no, column, name.substring(lastDot+1) + " �v���p�e�B", indent_level+1 );
		}
	}
	// (function() { �̏���
	else if (/^\s*;*\(\s*function\s*\([^\)]*\)\s*/.test(line_str)) {
		if (extending[0] != "�u���b�N") {
			Outline.AddFuncInfo2( line_no, column, "�u���b�N", indent_level );
			setExtending(indent_level, "�u���b�N");
		}
	}

	// for prototype.js
	// Object.extend �̏���
	else if (/^\s*(var\s)?\s*[\w$.]+\s*=\s*Object\.extend\(/.test(line_str)) {
		var name = line_str.replace(/^.*\b([\w$.]+)\s*=.*$/, "$1");
		Outline.AddFuncInfo2( line_no, column, name + " �I�u�W�F�N�g", indent_level );
	}
	else if (/^\s*.*(Object\.)?extend\(\s*[\w$.]+\s*,/.test(line_str)) {
		var name = line_str.replace(/^\s*.*extend\(\s*([\w$.]+).*$/, "$1");
		if (name != extending[indent_level]) {
			Outline.AddFuncInfo2( line_no, column, name + " �g��", indent_level );
			setExtending(indent_level, name);
		}
	}
	// Class.create �̏���
	else if (/^\s*(var\s)?\s*[\w\$]+\s*=\s*Class\.create\s*\(/.test(line_str)) {
		var name = line_str.replace(/^.*\b([\w\$]+)\s*=.*$/, "$1");
		Outline.AddFuncInfo2( line_no, column, name + " �N���X", indent_level );
		//Class.create�z���̗v�f�̓C���X�^���X�ɕt������̂ŁA(�N���X��).xxx�Ƃ͋�ʂ���
		//setExtending(indent_level, name);
	}

	// for jQuery
	// jQuery.extend, jQuery.fn.extend�̏���
	else if (/^\s*jQuery\.extend\(/.test(line_str)) {
		if (extending[0] != "jQuery") {
			Outline.AddFuncInfo2( line_no, column, "jQuery �g��", 0 );
			setExtending(0, "jQuery");
		}
	}
	else if (/^\s*jQuery\.fn\.extend\(/.test(line_str)) {
		if (extending[0] != "jQuery.prototype") {
			Outline.AddFuncInfo2( line_no, column, "jQuery.prototype �g��", 0 );
			setExtending(0, "jQuery.prototype");
		}
	}
	else if (/^\s*jQuery\.each\(.*[{\[]\s*$/.test(line_str)) {
		if (extending[0] != "jQuery.prototype") {
			Outline.AddFuncInfo2( line_no, column, "jQuery.each �u���b�N", indent_level );
			setExtending(indent_level, "�u���b�N");
		}
	}

	// for dojo
	// dojo.mixin�̏���
	else if (/^\s*(dojo|d)\.mixin\(\s*[\w$.]+/.test(line_str)) {
		var extend_target = line_str.replace(/^.*\bmixin\(\s*([\w$.]+).*$/, "$1");
		if (extend_target != extending[indent_level]) {
			Outline.AddFuncInfo2( line_no, column, extend_target + " �g��", indent_level );
			setExtending(indent_level, extend_target);
		}
	}
	else if (/^\s*(var\s)?\s*[\w$.]+\s*=\s*(dojo|d)\.mixin\(/.test(line_str)) {
		var target = line_str.replace(/^\s*(var\s)?\s*([\w$.]+)\s*=.*$/, "$2");
		Outline.AddFuncInfo2( line_no, column, target + " �I�u�W�F�N�g", indent_level );
		setExtending(indent_level, target);
	}

}

