/**
 * Created with PyCharm.
 * User: SQQ
 * Date: 14-4-27
 * Time: 下午5:12
 * To change this template use File | Settings | File Templates.
 */

var dChart={
    init:function(){
        $("#closeBox").click(function(){
            $("#chartBox").css("display","none");
        })
    },
    groupByPro:function(){
        var display=[]
        var numCity=[]
        var cityProcice=[]
        var totalGdp=[]
        var totalPopu=[]
        var perGdp=[]
        $.post("/map/",{name:$("#kw").val(),chartType:"2"},function(s){
            s=JSON.parse(s);
//            console.debug(s)
            console.debug(s[0].totalGdp)
            s.sort(function(a,b){
                return b.numCity - a.numCity;
            })
            getinfo(s);
            console.debug(s.length);
            dChart.chartLine(display);
            $("#chartBox").append("<div id='closeBox'>&otimes;</div>");
            dChart.init();
        });
        function getinfo(s){
            for(i=0;i< s.length;i++){
                numCity.push(s[i].numCity);
                cityProcice.push(s[i].cityProcice);
                totalGdp.push(parseInt(s[i].totalGdp)/1000);
                totalPopu.push(parseInt(s[i].totalPopu)/100);
                perGdp.push(parseInt(s[i].perGdp)/1000);
            }
            display=[numCity,cityProcice,totalGdp,totalPopu,perGdp];
            console.debug(display);
        };
    },
    groupBybatch:function(){
        var yA=['2003', '2006', '2007', '2008', '2010','2014'];
        $.post("/map/",{name:$("#kw").val(),chartType:"3"},function(s){
            s=JSON.parse(s);
            console.debug(s)
            console.debug(s.towns);
            dChart.chartColumn(s.villages, s.towns,yA);
            $("#chartBox").append("<div id='closeBox'>&otimes;</div>");
            dChart.init();
        });
    },
    groupByregion:function(){
        var yA=['华东','华北','中南','西北','西南','华南','东北'];
        $.post("/map/",{name:$("#kw").val(),chartType:"5"},function(s){
            s=JSON.parse(s);
            console.debug(s)
            console.debug(s.towns);
            dChart.chartColumn(s.villages, s.towns,yA);
            $("#chartBox").append("<div id='closeBox'>&otimes;</div>");
            dChart.init();
        });
    },
    getDensity:function(){
        var numCity=[]
        var cityProcice=[]
        var perDensity=[]
        $.post("/map/",{name:$("#kw").val(),chartType:"4"},function(s){
            s=JSON.parse(s);
//            console.debug(s)
            getinfo(s);
            var curChart=dChart.chartComm();
            curChart.xAxis[0].setCategories(xdisplay)
            for (i=0;i< ydisplay.length;i++){
    //            console.debug(y[i].data);
                curChart.series[i].setData(ydisplay[i].data);
    //            console.debug(y[i].name);
                curChart.series[i].name=ydisplay[i].name;
            }
            $("#chartBox").append("<div id='closeBox'>&otimes;</div>");
            dChart.init();
        });
        function getinfo(s){
            for(i=0;i< s.length;i++){
                numCity.push(s[i].numCity);
                cityProcice.push(s[i].cityProcice);
                perDensity.push(parseFloat(s[i].perDensity))
            };
            xdisplay=[{"name":"The name procice","data":cityProcice}]
            ydisplay=[{"name":"Total number","data":numCity},{"name":"The Density","data":perDensity}];
            console.debug(ydisplay);
        };
    },
    drag:function(){
        var _move=false;//移动标记
        var _x,_y;//鼠标离控件左上角的相对位置
        $("#chartBox").mousedown(function(e){
            _move=true;
//            console.debug(e.pageX)
            _x=e.pageX-parseInt($("#chartBox").css("left"));
            _y=e.pageY-parseInt($("#chartBox").css("top"));
            $("#chartBox").fadeTo(20, 0.25);//点击后开始拖动并透明显示
//            console.debug(_x,_y);
        }).mousemove(function(e){
            if( _move){
                var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y;
                $("#chartBox").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move=false;
            $("#chartBox").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
     },

     chartLine: function(data){
        $('#chartBox').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '全国名镇名村分布'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories:data[1]
            },
            yAxis: {
                allowDecimals:true,
                title: {
                    text: '名镇名村 (个)'
                }
            },
            tooltip: {
                   formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y;
                }
            },
            plotOptions: {
                min:0,
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Total number',
                data: data[0]
            },{
                name: 'The GDP (100B)',
                data: data[2]
            },{
                name: 'The Population (M)',
                data: data[3]
            },{
                name: 'Real GDP per capital (T)',
                data: data[4]
            }]
        })
    },
    chartColumn:function (x,y,yA) {
        $('#chartBox').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '历年名镇名村个数'
            },
            xAxis: {
                categories: yA
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total numbers'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'total'
                }
            },
            series: [{
                name: 'villages',
                data: x
            }, {
                name: 'towns',
                data: y
            }]
        });
    },
    chartComm:function () {
        $('#chartBox').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
            },
            yAxis: {
                allowDecimals:true,
                title: {
                    text: ''
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
            },{
            },{
            },{
            },{
            },{
            },{
            },{
            },{
            },{
            },{
            }
            ]
        });
        var mychart = $('#chartBox').highcharts();
        return mychart


    }
}