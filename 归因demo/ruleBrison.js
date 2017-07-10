$package('icc.ruleBrison');
var deleteData=function(index){
    $('#dataList').datagrid('deleteRow',index);
    var rows= $('#dataList').datagrid('getRows');
    $('#dataList').datagrid('loadData',rows);
    $('#dataList').datagrid('unselectAll');
};
icc.ruleBrison = function () {
    var _this = {
        ruleCdList:[{
                  "id":1,
                  "text":"text1"
                },{
                  "id":2,
                  "text":"text2"
                },{
                  "id":3,
                  "text":"text3"
                },{
                  "id":4,
                  "text":"text4"
                },{
                  "id":5,
                  "text":"text5"
                }]
                ,
        config: {
            action:{
                getRuleCdList:'data/ruleCd.json',
                getTreeList:'data/tree.json',
                getGridList:'data/dataGrid.json'
            },
            event: {
                export:function(){
                    alert('导出');
                },
                search:function(){
                    //alert('查询');
                    var param = $('#searchForm').serializeObjectBySearch();
                    for(c in param){
                        param[c] = $.trim(param[c]);
                        if(param[c]==null||param[c]==''){
                            delete param[c];
                        }
                    }
                    if(!param.startDate){
                        icc.alert('提示', '请填写开始时间', 'info');
                        return
                    }
                    if(!param.endDate){
                        icc.alert('提示', '请填写结束时间', 'info');
                        return
                    }
                    if(!param.ruleCd){
                        icc.alert('提示', '请选择分类规则', 'info');
                        return
                    }

                    //console.log(param);
                    var _url = 'ruleBrisionRes.html';
                    var _content = "<iframe id='main'  scrolling='auto' frameborder='0' src='"
                        + _url
                        + "' style='width:100%; height:100%;'  ></iframe>";

                    var winSearchConfig = {
                        width : document.body.scrollWidth*0.95,
                        height : document.body.scrollHeight*0.95,
                        closable : true,
                        title : '数据查询',
                        modal : true,
                        resizable : true,
                        maximizable : true,
                        collapsible : false,
                        cache : false,
                        content : _content,
                        buttons : [{
                            text : '关闭',
                            iconCls : 'icon-cancel',
                            handler : function() {
                                $('#searchTable').dialog('close');
                            }
                        } ]
                    };
                    $('#searchTable').dialog(winSearchConfig);
                    $('#searchTable').dialog('open');
                    $('#searchTable').dialog('center');
                    //$('#searchTable').dialog("maximize");
                },
                roleListClick: function (node) {
                    //console.log(node.id);
                    //alert('选中了一个节点');
                    //$.ajax({
                    //    url: _this.config.action.getGridList,
                    //    type: 'post',
                    //    data: {'param': node.id},
                    //    success: function (data) {
                    //        $('#dataList').datagrid('loadData',data);
                    //    }
                    //});
                }
            }
        },
        init: function () {

            //表格加载
            var dataconfig = {
                title : '',
                border : false,
                autoRowHeight : true,
                fitColumns: true,
                multiSort:true,
                method: 'post',
                pagination : false,
                rownumbers : true,
                pageSize : 50,
                pageNumber : 1,
                showFooter : true,
                pageList : [ 50,100, 200,500 ],
                // url : _this.config.action.getGridList,
                loadMsg :  '数据加载中 ...',
                idField : 'assetCd',
                singleSelect: true,
                columns: [[
                    {
                        width: 80,
                        field: 'assetCd',
                        title: '组合代码'

                    },
                    {
                        width: 80,
                        field: 'assetNm',
                        title: '组合名称'

                    },{
                        width: 80,
                        field: 'benmType1',
                        title: "<input type='radio' name='benmType' value='benmType1'/>合约基准</input>",
                        formatter:function(value,row,index){
                            if(value){
                                return "<input type='radio' flag='benmType1' name="+index+" value='+value+'/>"+value+"</input>"

                            }
                        }

                    },
                    {
                        width: 80,
                        field: 'benmType2',
                        title: "<input type='radio' name='benmType' value='benmType2'/>业绩报酬基准</input>",
                        formatter:function(value,row,index){
                            if(value){
                                return "<input type='radio' flag='benmType2' name="+index+" value='+value+'/>"+value+"</input>"

                            }
                        }

                    }, {
                        width: 80,
                        field: 'benmType3',
                        title: "<input type='radio' name='benmType' value='benmType3'/>通用基准</input>",
                        formatter:function(value,row,index){
                            if(value){
                                return "<input type='radio' flag='benmType3' name="+index+" value='+value+'/>"+value+"</input>"

                            }
                        }

                    },{
                        width: 80,
                        field: 'benmType4',
                        title: "<input type='radio' name='benmType' value='benmType4'/>补充基准1</input>",
                        formatter:function(value,row,index){
                            if(value){
                                return "<input type='radio' flag='benmType4' name="+index+" value='+value+'/>"+value+"</input>"

                            }
                        }

                    },{
                        width: 80,
                        field: 'benmType5',
                        title: "<input type='radio' name='benmType' value='benmType5'/>补充基准2</input>",
                        formatter:function(value,row,index){
                            if(value){
                                return "<input type='radio' flag='benmType5' name="+index+" value='+value+'/>"+value+"</input>"

                            }
                        }

                    },{
                        width : 80,
                        field : 'operation',
                        title : '操作',
                        align : 'center',
                        formatter:function(value,row,index){
                            return '<input type="button"  onclick="deleteData('+index+')" style="width:80%;margin:0 auto;background-color:red;color:#fff;border:1px solid #000;border-radius: 5px ;cursor: pointer;" value="删除"/>'

                        }
                    }

                ]],
                loader: function (param, success, error) {
                        success(data1);
                },
                onLoadSuccess :  function(data) {

                    //表格里单选框点击时各种情况方法
                    var $benmTypes=$("input[name=benmType]");
                    var $radios=$("input[name!=benmType][name!=asstTree]");
                    $benmTypes.prop("checked",false);

                    //点击表头单选框时
                    $benmTypes.click(function(){
                        $radios.prop("checked",false);
                        var value = $("input[name=benmType]:checked").val();

                        $.each($("input[type='radio'][name!=benmType][name!=asstTree]"),function(){

                            if($(this).attr('flag')==value){
                                $(this).prop("checked",true);
                            }

                        });

                    });

                    //点击表格单选框时
                    $radios.click(function(){
                        if($(this).is(':checked') && $(this).attr('flag')!=$("input[name=benmType]:checked").val()){
                            $benmTypes.prop("checked",false);
                        }
                    })

                }
            };
            $('#dataList').datagrid(dataconfig);

            //获取分类规则的下拉框内容
            // icc.ajaxJsonByNoAsync(_this.config.action.getRuleCdList, '', function (data) {
            //     if (data) {
            //         _this.ruleCdList = data;
            //     }
            // });

            //搜索tree的text
            $('#searchId').bind('keypress',function(event){
                if(event.keyCode=='13'){
                    var searchText = $('#searchId').val();
                    var node=$('#asstTree').tree('getChildren');
                    //console.log(node);
                    $('#asstTree').tree('collapseAll');
                    if(searchText){
                        $.each(node,function(index,value){
                            if(value.text.indexOf(searchText)>=0){
                                $('#asstTree').tree('expandTo',value.target);
                            }
                        });
                    }

                }
            });

            //点击单选框按条件加载tree
            var $asstTree = $("input[name=asstTree]");
            $asstTree.click(function(){
                var value = $("input[name=asstTree]:checked").val();
                // $.ajax({
                //     type : 'post',
                //     url : _this.config.action.getTreeList,
                //     data : {
                //         'id' : value
                //     },
                //     dataType : 'json',
                //     success : function(data) {
                //         $('#asstTree').tree('loadData',data);
                //     }
                // })
            });

            //分类规则的下拉框
            $('#ruleCd').combobox({
                multiple:false,
                panelHeight:'auto',
                limitToList:false,
                valueField:'id',
                textField:'text',
                data:_this.ruleCdList,
                formatter: function(row){
                    var opts = $(this).combobox('options');
                    return row[opts.textField];
                },
                icons:[{
                    iconCls:'icon-clear',
                    handler:function(){
                        $('#ruleCd').combobox('clear');
                    }
                }]
            });

            //tree加载以及select方法
            $('#asstTree').tree({
                // url:_this.config.action.getTreeList,
                lines: true,
                checkbox:true,
                onlyLeafCheck:true,
                loader: function (param, success, error) {
                        success(Tree);
                },
                onSelect: function (node) {
                    var cknodes = $('#asstTree').tree("getChecked");
                    for (var i = 0; i < cknodes.length; i++) {
                        if (cknodes[i].id != node.id) {
                            $('#asstTree').tree("uncheck", cknodes[i].target);
                        }
                    }
                    if (node.checked) {
                        $('#asstTree').tree('uncheck', node.target);

                    } else {
                        $('#asstTree').tree('check', node.target);
                        _this.config.event.roleListClick(node);

                    }

                },
                onLoadSuccess :function(node, data){
                    $(this).find('span.tree-checkbox').unbind().click(function () {
                        $('#asstTree').tree('select', $(this).parent());
                        return false;
                    });
                    $('#asstTree').tree('collapseAll');
                }
            });
            $('#btnexport').click(_this.config.event.export);
            $('#btnSearch').click(_this.config.event.search);
        }
    };
    return _this;
}();

$(function () {
    icc.ruleBrison.init();
});