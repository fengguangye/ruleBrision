$package('icc.ruleBrisonRes');

icc.ruleBrisonRes = function () {
    var _this = {
        ruleCdList:[],
        config: {
            action:{
                getGridList:'data/pythonData.json'
            },
            event: {
                changeData:function(array,treeDa,flag){
                    for(var key in treeDa){
                        if(_this.config.event.isEmptyObject(treeDa[key].value)){
                            continue;
                        }
                        var children= new Array();
                        var node ={};
                        if(flag==1){
                            node["id"]=Math.random()*999;
                            node["name"]=key;
                            var values=treeDa[key].value;
                            _this.config.event.addValues(node,values);
                        }else{
                            node["id"]=Math.random()*999;
                            node["name"]=treeDa[key].node_name;
                            var values=treeDa[key].value;
                            _this.config.event.addValues(node,values);
                        }
                        if(treeDa[key]['sub_nod_list']){

                            var array2=new Array();
                            var child2=_this.config.event.changeData(array2,treeDa[key]['sub_nod_list'],1);
                            children=children.concat(child2);
                        }
                        if(treeDa[key]['sub_groups']){

                            var array3=new Array();
                            var child3=_this.config.event.changeData(array3,treeDa[key]['sub_groups'],2);
                            children=children.concat(child3);
                        }
                        node['children']=children;
                        array.push(node);

                    }
                    
                    // console.log(array);
                    return array;
                },
                addValues:function (node,values){
                        for(var key in values){
                            if(values[key]===''){
                                node[key]='-';
                            }else{
                                node[key]=values[key];
                            }
                
                        }
                    },
                isEmptyObject:function (e) {
                        var t;
                        for(t in e){
                            return !1;
                        }
                        return !0;
                    }
}
        },
        init: function () {
            $('#treegrid').treegrid({
                //url:_this.config.action.getGridList,
                idField:'id',
                treeField:'name',
                animate:false,
                fitColumns:true,
                autoRowHeight:false,
                //loadMsg:'正在加载中。。。',
                border:false,
                lines:false,
                columns:[[
                    {title:'分类规则',field:'name',width:180},
                    {title:'个券代码',field:'sec_code',width:100,align:'center'},
                    {title:'选择',field:'selection',width:100,align:'center'},
                    {title:'配置',field:'allocation',width:100,align:'center'},
                    {title:'交叉',field:'interaction',width:100,align:'center'},
                    {title:'总计',field:'total',width:100,align:'center'}
                ]],
                loader: function (param, success, error) {
                    // $.ajax({
                    //     url: _this.config.action.getGridList,
                    //     data: '',
                    //     type: 'post',
                    //     success: function (data) {
                    //         var array= new Array();
                    //         var newData = _this.config.event.changeData(array,data,1);
                    //         console.log(newData.length);
                    //         if(newData.length){
                    //             $.each(newData[0].children,function(index,value) {
                    //             value.state = 'closed'
                    //         })
                    //         }                            
                    //         success(newData);
                    //     }
                    // });
                    var array= new Array();
                    var newData = _this.config.event.changeData(array,treegridData,1);

                    // console.log(newData.length);
                            if(newData.length){
                                $.each(newData[0].children,function(index,value) {
                                value.state = 'closed'
                            })
                            }                            
                            success(newData);
                }
            });

        }
    };
    return _this;
}();

$(function () {
    icc.ruleBrisonRes.init();
});