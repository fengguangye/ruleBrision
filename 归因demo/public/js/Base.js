$package('icc');
var icc = {
	getRootPath:function(){
		var pathName=window.document.location.pathname;
		var projectName= pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		return (projectName)
	},
	pageList:[ 50,100, 200,500 ],
	isJson : function(str) {
		var obj = null;
		try {
			obj = icc.paserJson(str);
		} catch (e) {
			return false;
		}
		var result = typeof (obj) == "object"
				&& Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
				&& !obj.length;
		return result;
	},
	paserJson : function(str) {
		return eval("(" + str + ")");
	},
	/*表格下方合计*/
	compute:function(colName){
		var rows = $('#dataList').datagrid('getRows');
		//console.log(rows.length);
		var total = 0.0;
		for (var i = 0; i < rows.length; i++) {
			if(rows[i][colName]==null){
				rows[i][colName]=0;
			}
			total += (parseFloat(rows[i][colName])*10000000000);
		}
		total=parseInt(total)/10000000000;
		return total;
	},
	/* 弹出框 */
	alert : function(title, msg, icon, callback) {
		$.messager.alert(title, msg, icon, callback);
	},
	/* 弹出框 */
	confirm : function(title, msg, callback) {
		$.messager.confirm(title, msg, callback);
	},
	/* 全选 */
	selectAll : function(name) {
		name.datagrid("selectAll")
	},
	/* 全不选 */
	noSelectAll : function(name) {
		name.datagrid("clearSelections")
	},
	/* 反选 */
	selectInvert : function(name) {
		var pageRow = name.datagrid("getRows");//找到所有行

		var selecRow = name.datagrid("getSelections");//找到所选中的行

		var selecRowIdex =[];//选中行数索引
		var pageRowIdex=[];//所有行数索引
		for(var i=0;i<pageRow.length;i++){
			pageRowIdex.push(i);
			for(var j=0;j<selecRow.length;j++){
				if(pageRow[i]==selecRow[j]){
					selecRowIdex.push(i);
				}
			}
		}
		for(var i=0;i<pageRowIdex.length;i++){//找出反选行索引
			for(var j=0;j<selecRowIdex.length;j++){
				if(pageRowIdex[i]==selecRowIdex[j]){
					pageRowIdex.splice(i,1);
					i--;
				}
			}
		}

		name.datagrid("clearSelections");//清除所有勾引选项

		for(var i=0;i<pageRowIdex.length;i++){
			name.datagrid("selectRow",pageRowIdex[i]);
		}
	},
	checkSelect : function(rows) {
		var records = rows;
		if (records != null) {
			return true;
		}
		icc.alert('警告', '未选中记录.', 'warning');
		return false;

	},
	progress : function(title, msg) {
		var win = $.messager.progress({
			title : title || '请等待',
			msg : msg || '读取数据中...'
		});
	},
	closeProgress : function() {
		$.messager.progress('close');
	},
	getStatusByValueExport:function(value){
		if(value=='0'){
			return '<span style="color: black">未导出</span>';

		}
		if(value=='1'){
			return '<span style="color: blue">导出中</span>';

		}
		if(value=='2'){
			return '<span style="color: green">成功</span>';

		}
		if(value=='3'){
			return '<span style="color: red">失败</span>';

		}
	},
	getStatusByValueImport:function(value){
		if(value=='0'){
			return '<span style="color: black">未导入</span>';

		}
		if(value=='1'){
			return '<span style="color: blue">导入中</span>';

		}
		if(value=='2'){
			return '<span style="color: green">成功</span>';

		}
		if(value=='3'){
			return '<span style="color: red">失败</span>';

		}
	},
	addTab : function(_url, _title) {
		var formatTable =/parameter+/;
		var boxId = '#tt';
		_url += ".htm?a="+Math.random();
		if(_title =='专户清算'){
			var allTabs = $(boxId).tabs('tabs');
			if(allTabs.length>1){
				icc.confirm("确认等待", "开始清算时将禁止系统参数配置，您确认现在开始清算？", function(data){
					if(data){
						for(var i = 1, len = allTabs.length; i < len; i++) {
							var title = allTabs[i].panel('options').content;
							if(formatTable.test(title))
								$(boxId).tabs('close', 1);
						}
					}else{
						$(boxId).tabs('close', '专户清算');
					}
				});
			}
		}

		if ($(boxId).tabs('exists', _title)) {
			var tab = $(boxId).tabs('getTab', _title);
			var index = $(boxId).tabs('getTabIndex', tab);
			$(boxId).tabs('select', index);
			if (tab && tab.find('iframe').length > 0) {
				var _refresh_ifram = tab.find('iframe')[0];
				_refresh_ifram.contentWindow.location.href = _url;
				//var mainheight = _refresh_ifram.contents().find("body")
				//				.height() + 30;
				//_refresh_ifram.height(mainheight);
			}
		} else {
			window.openedTab.push({'url':_url,'title':_title});
			sessionStorage.openedTab=JSON.stringify(window.openedTab);
			/*if($(boxId).tabs('exists', '专户清算') && formatTable.test(_url)){
			 icc.alert('温馨提示', '清算中，严禁系统参数配置！', 'error');
			 return ;
			 }*/
			var _content = "<iframe id='main'  scrolling='auto' frameborder='0' src='"
					+ _url + "' style='width:100%; height:100%;'  ></iframe>";
			$(boxId).tabs('add', {
				title : _title,
				content : _content,
				closable : true,
				tools:[{
					iconCls:'icon-mini-refresh',
					handler:function(){
						var tab = $('#tt').tabs('getSelected');  // 获取选择的面板
						var refeshTab = $('#tt').tabs("getTab", _title);
						if (tab != refeshTab) {
							$('#tt').tabs("select", _title);
							tab = refeshTab;
						}
						var url = $(tab.panel('options').content).attr('src');
						$('#tt').tabs('update', {
							tab: tab,
							options: {
								content:"<iframe id='main'  scrolling='auto' frameborder='0' src='"
								+ url + "' style='width:100%; height:100%;'  ></iframe>"
							}
						});
					}
				}]
			});

		}
	},
	iFrameHeight : function() {

		var mainheight = $(this).contents().find("body").height() + 30;
		$(this).height(mainheight);

	},
	addTabs : function(pageName, title) {
		var tabid = '#tt';
		var exists = $(tabid).tabs('exists', title);
		if (exists) {
			$(tabid).tabs('select', title);
			return;
		}

		$(tabid).tabs('add', {
			title : title,
			content : title,
			closable : true,
			href : pageName + '.htm'
		});
	},
	/* 重新登录页面 */
	toLogin : function() {
		window.top.location = "/login.htm";
	},
	checkLogin : function(data) {// 检查是否登录超时
		if (data.logoutFlag) {
			icc.closeProgress();
			icc.alert('提示', "登录超时,点击确定重新登录.", 'error', icc.toLogin);
			return false;
		}
		return true;
	},
	ajaxSubmit : function(form, option) {
		form.ajaxSubmit(option);
	},
	ajaxJson : function(url, option, callback) {
		if(url.indexOf("?")>-1){
			url = url+"&a="+Math.random();
		}else{
			url = url+"?a="+Math.random();
		}

		$.ajax(url, {
			type : 'post',
			dataType : 'json',
			data : option,
			success : function(data) {
				// 坚持登录
				if (!icc.checkLogin(data)) {
					return false;
				}
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error : function(response, textStatus, errorThrown) {
				try {
					icc.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!icc.checkLogin(data)) {
						return false;
					} else {
						icc.alert('提示', data.msg || "请求出现异常,请速度联系联系管理员或运维人员", 'error');
					}

				} catch (e) {
					icc.alert('提示', "系统出现异常,请速度联系管理员或运维人员", 'error');
				}
//				icc.alert('提示', errorThrown, 'error');
			},
			complete : function() {

			}
		});
	},
	ajaxJsonByNoAsync : function(url, option, callback) {
		$.ajax(url, {
			type : 'post',
			dataType : 'json',
			data : option,
			async : false,
			success : function(data) {
				// 坚持登录
				if (!icc.checkLogin(data)) {
					return false;
				}
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error : function(response, textStatus, errorThrown) {
				try {
					icc.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!icc.checkLogin(data)) {
						return false;
					} else {
						icc.alert('提示', data.msg || "请求出现异常,请速度联系管理员或运维人员", 'error');
					}
				} catch (e) {
					icc.alert('提示', "系统出现异常,请速度联系管理员或运维人员", 'error');
				}
			},
			complete : function() {

			}
		});
	},
	ajaxJsonByNoAsyncProcess : function(url, option, callback) {
		$.ajax(url, {
			type : 'post',
			dataType : 'json',
			data:option,
			cache: false,
			sync:false,
			beforeSend: function(){
				$.messager.progress({
					title: '请等待',
					msg: '操作处理中',
					text: '操作处理中.......'
				});
			},
			success : function(data) {
				icc.closeProgress();
				// 坚持登录
				if (!icc.checkLogin(data)) {
					return false;
				}
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error : function(response, textStatus, errorThrown) {
				try {
					icc.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!icc.checkLogin(data)) {
						return false;
					} else {
						icc.alert('提示', data.msg || "请求出现异常,请速度联系管理员或运维人员", 'error');
					}
				} catch (e) {
					icc.alert('提示', "系统出现异常,请速度联系管理员或运维人员", 'error');
				}
			},
			complete : function() {
				icc.closeProgress();
			}
		});
	},
	ajaxJsonByNoAsyncFormatOpertion : function(url, option, callback) {
		$.ajax(url, {
			type : 'post',
			dataType : 'json',
			data:JSON.stringify(option),
			cache: false,
			sync:false,
			contentType: "application/json",
			beforeSend: function(){
				$.messager.progress({
					title: '请等待',
					msg: '操作处理中',
					text: '操作处理中.......'
				});
			},
			success : function(data) {
				icc.closeProgress();
				// 坚持登录
				if (!icc.checkLogin(data)) {
					return false;
				}
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error : function(response, textStatus, errorThrown) {
				try {
					icc.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!icc.checkLogin(data)) {
						return false;
					} else {
						icc.alert('提示', data.msg || "请求出现异常,请速度联系管理员或运维人员", 'error');
					}
				} catch (e) {
					icc.alert('提示', "系统出现异常,请速度联系管理员或运维人员", 'error');
				}
			},
			complete : function() {
				icc.closeProgress();
			}
		});
	},
	submitForm : function(form, callback, dataType) {
		var option = {
			type : 'post',
			dataType : dataType || 'json',
			success : function(data) {
				if ($.isFunction(callback)) {
					callback(data);
				}
			},
			error : function(response, textStatus, errorThrown) {
				try {
					icc.closeProgress();
					var data = $.parseJSON(response.responseText);
					// 检查登录
					if (!icc.checkLogin(data)) {
						return false;
					} else {
						icc.alert('提示', data.msg || "请求出现异常,请速度联系管理员或运维人员", 'error');
					}
				} catch (e) {
					icc.alert('提示', "系统出现内部错误,请速度联系管理员或运维人员", 'error');
				}
			},
			complete : function() {

			}
		};
		icc.ajaxSubmit(form, option);
	},
	getById : function(url, option, callback) {
		icc.progress();
		icc.ajaxJson(url, option, function(data) {
			icc.closeProgress();
			if (data.success) {
				if (callback) {
					callback(data);
				}
			} else {
				icc.alert('提示', data.msg, 'error');
			}
		});
	},
	deleteForm : function(url, option, callback) {
		icc.progress();
		icc.ajaxJson(url, option, function(data) {
			icc.closeProgress();
			if (data.success) {
				icc.alert('提示', '删除成功', 'info');
				if (callback) {
					callback(data);
				}
			} else {
				icc.alert('提示', data.msg, 'error');
			}
		});
	},
	saveForm : function(url, option, callback) {
		icc.progress('请稍后', '保存中...');
		icc.ajaxJson(url, option, function(data) {
			icc.closeProgress();
			if (data.success) {
				icc.alert('提示','保存成功', 'info');

			} else {
				icc.alert('提示', data.msg, 'error');
			}
			if (callback) {
				callback(data);
			}
		});
	},
	// 将propertygrid控件里的数据转为更新请求的对象，过滤Null值的对象
	getRowsConvertObject : function(rows) {
		var option = {};
		$.each(rows, function() {
			if (option[this.field]) {

				if (!option[this.field].push) {
					option[this.field] = [ option[this.field] ];
				}

				option[this.field].push(this.value);

			} else {
				if (this.value != null) {
					option[this.field] = this.value;
				}
			}

		});
		return option;
	},
	// 将grid控件里的数据转为更新请求的对象，过滤Null值的对象
	getSelectRowsConvertObject : function(rows) {
		var option = [];
		$.each(rows, function(i) {
			if (rows[i] != null) {
				option.push(rows[i]);
			}
		});
		return option;
	},
	getTextByValue : function(obj, value) {
		var text = value;
		$.each(obj, function() {
			if (this.value == value) {
				text = this.text;
				return false;
			}
		});
		return text;
	},
	getStringConvertDate : function(strTime) {
		var date = new Date(Date.parse(strTime.replace(/-/g, "/")));
		return date;
	},
	getDateConvertString : function(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var result = y + '-' + (m < 10 ? ('0' + m) : m) + '-'
				+ (d < 10 ? ('0' + d) : d);
		return result;
	},
	//combobox全选
	comboboxSelectAll:function(cmbox){
		var data=cmbox.combobox('getData');
		var values=[];
		$.each(data,function(a,b){
			values.push(b.value);
		});
		cmbox.combobox('setValues',values);
	},//文件上传
	ajaxFileUpload:function ajaxFileUpload(url,callback) {
		var file = document.getElementById('fileToUpload').files[0];
		if(!file){
			icc.alert('提示', '请选择要导入的文件', 'info');
			return;
		}
		var fileName = file.name;
		var file_typename = fileName.substring(fileName.lastIndexOf('.'),
				fileName.length);

		if (file_typename == '.xls'||file_typename == '.xlsx') {
			if (file) {
				if((Math.round(file.size * 100 / (1024 * 1024)) / 100)>1024){
					icc.alert('提示', '上传的文件大于1024MB', 'info');
					return;
				}
			}

		} else {
			icc.alert('提示', '请上传Excel格式文件', 'info');
			return;

		}
		icc.progress();
		$.ajaxFileUpload({
			url : url||'parameter/FundOrgBusinessLimitMo/importData',
			secureuri : false,
			fileElementId : 'fileToUpload',
			dataType : 'json',
			success : function(data) {
				icc.closeProgress();
				if (callback) {
					callback(data);
				}

			},
			error: function(data,status,e) {
				icc.closeProgress();
				alert('失败');
			}
		});
	},
	getUrlParam: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},
	setUserRoleControl:function(dataGridConfig){
		var exportVar = "";
		icc.ajaxJsonByNoAsync('../..'+icc.getRootPath()+'/getUserRole', null, function (data) {
			if (!data.notOnlySelectAccess) {
				for ( var i = 0; i < dataGridConfig.toolbar.length; i++) {
					if(dataGridConfig.toolbar[i].id =="btnexport"){
						exportVar= dataGridConfig.toolbar[i];
					}
				}
				dataGridConfig.toolbar=[];
				if(exportVar!="")
					dataGridConfig.toolbar.push(exportVar);

			}
		});

		return dataGridConfig;
	}
};

// 将propertygrid里的combobox控件选中的value转成text
$.extend($.fn.propertygrid.defaults.columns[0][1], {
	formatter : function(value, rowData, rowIndex) {
		if (rowData.editor) {
			var editorOptions = rowData.editor.options;
			if (editorOptions == undefined) {
				return value;
			}
			var data = editorOptions.data;
			if (data == undefined) {
				return value;
			}
			for ( var i = 0; i < data.length; i++) {
				if (data[i]['value'] == value) {
					return data[i]['text'];
				}
			}
		}
	}
});


$.extend($.fn.validatebox.defaults.rules, {
	minLength : { // 判断最小长度
		validator : function(value, param) {
			value = $.trim(value); // 去空格
			return value.length >= param[0];
		},
		message : '最少输入 {0} 个字符。'
	},
	length : {
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : "输入内容长度必须介于{0}和{1}之间."
	},

	musetLength : {
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len == param[0];
		},
		message : "输入内容长度必须为{0}位"
	},
	integer : {// 验证整数
		validator : function(value) {
			return /^[+]?[0-9]+\d*$/i.test(value);
		},
		message : '只能输入整数'
	},
	intOrFloat : {// 验证整数或小数
		validator : function(value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message : '只能输入数字'
	},
	maxNumber: {
		validator: function(value,param){
			if(value*1 <= param[0]*1 && value*1>=0){
				return true;
			}else if(value == null || value ==''){
				return true;
			}else{
				$.fn.validatebox.defaults.rules.maxNumber.message='请输入0-'+param[0]+'的数值范围';
			}

		},
		message: '请输入规定的范围'
	},
	maxString: {
		validator: function(value,param){
			if(value.length == param[0]*1){
				return true;
			}else{
				$.fn.validatebox.defaults.rules.maxString.message='请输入规定的范围';
			}

		},
		message: '请输入规定的范围'
	},
	validateNummber:{
		validator: function(value,param){
			//value.length指内容总长度，包括小数点位数 如:12.11长度为value.length==5
			if(value.length <= param[0]*1 && value*1>=0){
				var num = value.split('.');
				if(num[1] ==undefined){
					return true;
				}else{
					if(num[1].length <= param[1]){
						return true;
					}else{
						$.fn.validatebox.defaults.rules.validateNummber.message='最多可输入'+param[1]+'位小数';
						return false;
					}
				}
			}else{
				$.fn.validatebox.defaults.rules.validateNummber.message='请输入规定的范围';
				return false;
			}

		},
		message: '请输入规定的范围'
	},
	validateNummber2:{
		validator: function(value,param){
			//value.length指内容总长度，包括小数点位数 如:12.11长度为value.length==5
			if(value.length <= param[0]*1 && value*1>=0){
				var num = value.split('.');
				if(num[1] ==undefined){
					return true;
				}else{
					if(num[1].length <= param[1]){
						return true;
					}else{
						$.fn.validatebox.defaults.rules.validateNummber2.message='最多可输入'+param[1]+'位小数';
						return false;
					}
				}
			}else if(value.length==0){
				return true;
			}else{
				$.fn.validatebox.defaults.rules.validateNummber2.message='请输入规定的范围';
				return false;
			}

		},
		message: '请输入规定的范围'
	}
});

//将datagrid里的combobox控件选中的value转成text
//$.extend($.fn.datagrid.defaults.columns, {
//	formatter : function(value, rowData, rowIndex) {
//		if (rowData.editor) {
//			var editorOptions = rowData.editor.options;
//			if (editorOptions == undefined) {
//				return value;
//			}
//			var data = editorOptions.data;
//			if (data == undefined) {
//				return value;
//			}
//			for ( var i = 0; i < data.length; i++) {
//				if (data[i]['value'] == value) {
//					return data[i]['text'];
//				}
//			}
//		}
//	}
//});


$.fn.combobox.defaults.formatter=function(row){
	var opts = $(this).combobox('options');
	return row[opts.valueField]+'-'+row[opts.textField];

};
$.fn.combobox.defaults.groupFormatter=function(group){
	return '<span style="color:#95B8E7">' + group + '</span>';
};
$.fn.combobox.defaults.filter=function(q, row){
	var opts = $(this).combobox('options');
	var str=row[opts.valueField]+row[opts.textField];
	return str.indexOf(q)>-1?true:false;
};

/* 表单转成json数据 */
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	//将值为arrayList的转为String类型，方便后台接收
	$.each(o,function(oName,oValue){
		if($.isArray(oValue)){
			var listValue=oValue.toString().split(",");
			var strListValue="";
			$.each(listValue,function(){
				strListValue+=",'"+this+"'";
			});
			if (strListValue.length > 0) {
				strListValue = strListValue.substr(1);
			}
			o[oName]=strListValue;
		}
	});

	return o;
};

/* 查询表单转成json数据 */
$.fn.serializeObjectBySearch = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});

	var date_ymd= /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/;

	var param= /^[a-zA-Z]+$/;
	//将值为arrayList的转为String类型，方便后台接收
	$.each(o,function(oName,oValue){
		if(oValue==null||oValue==''){
			delete this;
		}else{
			if($.isArray(oValue)){
				var listValue=oValue.toString().split(",");
				var strListValue="";
				$.each(listValue,function(){
					strListValue+=",'"+this+"'";
				});
				if (strListValue.length > 0) {
					strListValue = strListValue.substr(1);
				}
				o[oName]=strListValue;
			}else{
//				&& oName != "acctId" && oName != "srcOrgId" && oName != "srcFundId"
//				if(!$.isNumeric(oValue)&&!date_ymd.test(oValue) ){
//					var newValue=oValue;
//					o[oName]="'"+newValue+"'";
//				}
				if(!date_ymd.test(oValue) ){
					var newValue=oValue;
					o[oName]="'"+newValue+"'";
				}
			}
		}


	});
	for(c in o){
		if(o[c]==null||o[c]==''){
			delete o[c];
		}
	}
	return o;
};


jQuery.extend({
	toJSON : function(object) {
		var type = typeof object;
		if ('object' == type) {
			if (Array == object.constructor)
				type = 'array';
			else if (RegExp == object.constructor)
				type = 'regexp';
			else
				type = 'object';
		}
		switch (type) {
			case 'undefined':
			case 'unknown':
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"'
						+ object.replace(/(\\|\")/g, "\\$1").replace(
								/\n|\r|\t/g,
								function() {
									var a = arguments[0];
									return (a == '\n') ? '\\n'
											: (a == '\r') ? '\\r'
											: (a == '\t') ? '\\t' : ""
								}) + '"';
				break;
			case 'object':
				if (object === null)
					return 'null';
				var results = [];
				for ( var property in object) {
					var value = jQuery.toJSON(object[property]);
					if (value !== undefined)
						results.push(jQuery.toJSON(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for ( var i = 0; i < object.length; i++) {
					var value = jQuery.toJSON(object[i]);
					if (value !== undefined)
						results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
		}
	},
	// 获取对象的长度，需要指定上下文 this
	Object : {
		count : function(p) {
			p = p || false;
			return $.map(this, function(o) {
				if (!p)
					return o;
				return true;
			}).length;
		}
	}
});

/*控件汉化begin*/
if ($.fn.pagination){
	$.fn.pagination.defaults.beforePageText = '第';
	$.fn.pagination.defaults.afterPageText = '共{pages}页';
	$.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}记录';
//	$.fn.pagination.defaults.pageList =[100,200,300,500];
//	$.fn.pagination.defaults.pageSize = 100;
}
if ($.fn.datagrid){
	$.fn.datagrid.defaults.loadMsg = '正在处理，请稍待。。。';
}
if ($.fn.treegrid && $.fn.datagrid){
	$.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager){
	$.messager.defaults.ok = '确定';
	$.messager.defaults.cancel = '取消';
}
if ($.fn.validatebox){
	$.fn.validatebox.defaults.missingMessage = '该输入项为必输项';
	$.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
	$.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
	$.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
	$.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
}
if ($.fn.numberbox){
	$.fn.numberbox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combobox){
	$.fn.combobox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combotree){
	$.fn.combotree.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combogrid){
	$.fn.combogrid.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.textbox){
	$.fn.textbox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.numberspinner){
	$.fn.numberspinner.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.calendar){
	$.fn.calendar.defaults.weeks = ['日','一','二','三','四','五','六'];
	$.fn.calendar.defaults.months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
}
if ($.fn.datebox){
	$.fn.datebox.defaults.currentText = '今天';
	$.fn.datebox.defaults.closeText = '关闭';
	$.fn.datebox.defaults.okText = '确定';
	$.fn.datebox.defaults.missingMessage = '该输入项为必输项';
	$.fn.datebox.defaults.formatter = function(date){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
	};
	$.fn.datebox.defaults.parser = function(s){
		if (!s) return new Date();
		var ss = s.split('-');
		var y = parseInt(ss[0],10);
		var m = parseInt(ss[1],10);
		var d = parseInt(ss[2],10);
		if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
			return new Date(y,m-1,d);
		} else {
			return new Date();
		}
	};
}
if ($.fn.datetimebox && $.fn.datebox){
	$.extend($.fn.datetimebox.defaults,{
		currentText: $.fn.datebox.defaults.currentText,
		closeText: $.fn.datebox.defaults.closeText,
		okText: $.fn.datebox.defaults.okText,
		missingMessage: $.fn.datebox.defaults.missingMessage
	});
}
if ($.fn.datetimespinner){
	$.fn.datetimespinner.defaults.selections = [[0,4],[5,7],[8,10],[11,13],[14,16],[17,19]]
}

/*控件汉化end*/

$.ajaxSetup({
	contentType:"application/x-www-form-urlencoded;charset=utf-8",
	complete:function(XMLHttpRequest,textStatus){
		var sessionstatus=XMLHttpRequest.getResponseHeader("sessionstatus");
		if(sessionstatus=="timeout"){
			alert('登录超时了！亲，请重新登录');
			window.open(icc.getRootPath(),'_top');
		}
	}
});

