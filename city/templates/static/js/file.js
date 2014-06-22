 /**
 * Created with PyCharm.
 * User: SQQ
 * Date: 14-6-15
 * Time: 下午2:11
 * To change this template use File | Settings | File Templates.
 */
var series=[];
var fromFile = {
    DataDisplay: function() {
        var curChart = createHighchart();
        curChart.series=GetSeriesData();
        console.debug(curChart);
        $("#chartBox").highcharts(curChart);
        
    },
    CreateTable: function(data) {
        var fields = data.results.fields;
        var rowCount = GetLength(data.results.rows)
        var cellCount = GetLength(fields)
        var table = $("<table border=\"1\">");
        table.appendTo($("#createtable"));
        for (var i = 0; i < rowCount; i++) 
        {
            
            var tr = $("<tr></tr>");
            tr.append("<input type='checkbox'/>");
            tr.appendTo(table);
            for (var j = 0; j < cellCount; j++) 
            {
                if (i == 0) {
                    var td = $("<td>" + fields[j] + "</td>");
                } 
                else {
                    var td = $("<td>" + data.results.rows[i][fields[j]] + "</td>");
                }
                
                td.appendTo(tr);
            }
        }
        $("#createtable").append("</table>");
        $("tr:odd").css("background-color", "#fff");
        $("tr:even").css("background-color", "#E4F5FF");
        
        $("table tr").mouseover(function() {
            $(this).css({"background-color": "#87CEEB"});
        }).mouseout(function(event) {
            var $index = $(this).index();
            if ($index % 2 == 0) {
                $(this).css({"background-color": "#fff"});
            } else {
                $(this).css({"background-color": "#E4F5FF"});
            }
        });
        CheckBoxDisplay();
    }


}

function CheckBoxDisplay() {
    var $firstBox = $("input:checkbox").eq(0);
    var $otherBox = $("input:checkbox:gt(0)");
    $otherBox.each(function() {
        $(this).click(function() {
            // console.debug($("input:checkbox::gt(0):checked").length+" "+$otherBox.length)
            if ($("input:checkbox::gt(0):checked").length == $otherBox.length) {
                $firstBox.attr("checked", true)
            } 
            else {
                $firstBox.attr("checked", false)
            }
        })
    
    })
    $firstBox.click(function() {
        if ($(this).attr("checked") == "checked") {
            $("input:checkbox").attr("checked", true)
        } 
        else {
            $("input:checkbox").attr("checked", false)
        }
    })

}

function GetSeriesData() {
    var series = []
    var hasChecked = $("tr input:checked").parent()
    hasChecked.each(function(index, value) {
        var serie = {}
        var data = []
        $(value).find("td").each(function(index) {
            if (index == 0) {
                serie["name"] = $(this).text()
                return true
            };
            data.push(toFloat($(this).text()));
        })
        serie["data"] = data;
        series.push(serie);
    })
    console.debug(series);
    return series
}

function GetTitle(){
    var filename=$("#selectfile")[0].files[0].name
    return filename.substr(0,filename.lastIndexOf("."))
}

function CreatexAxis() {
    var categories = []
    var xAxis = {}
    $("tr input:checkbox:first").parent().find("td:gt(0)").each(function() {
        categories.push($(this).text())
    })
    xAxis["categories"] = categories;
    console.debug(xAxis);
    return xAxis 
}

function CreateyAxis() {
    var yAxis = [{
            labels: {
                formatter: function() {
                    return this.value;
                },
                style: {
                    color: '#89A54E'
                }
            },
            title: {
                text: "人口数",
                style: {
                    color: '#89A54E'
                }
            }
        }];
    return yAxis
}

function GetLength(data) {
    var count = 0
    $(data).each(function(index, value) {
        if (value == undefined)
            return false;
        count++
    })
    return count
}

    function toFloat(value)
    {
        var floatvalue = undefined;
        if(value != undefined)
            {
                if($.isNumeric(value))
                {
                    floatvalue = parseFloat(value);
                }else
                {
            
                    floatvalue = parseFloat(value.replace(/[^\d\.-]/g, ""));   
                }
            }
    
        return floatvalue;
    }

function createHighchart() 
{
    var chartOption = 
    {
        chart: {
        },
        legend: {
            reversed: 0,y: 10
        },
        credits: {
            enabled: false
        },
        title: {
            text: GetTitle()
        },
        subtitle: {
            text: ''
        },
        xAxis: CreatexAxis(),
        yAxis: CreateyAxis(),
        tooltip: {
            shared: false
        },
        exporting: {
            filename: 'chart',
            type: "image/png"
        },
        plotOptions: {
            
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            },
            spline: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            },
            column: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            },
            bar: {
                events: {
                    click: function(e) 
                    {
                    
                    }
                },
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            },
            scatter: {
                
                dataLabels: {
                    align: "right",
                    enabled: true,
                    format: '<b>{series.name}</b>'
                },
                showInLegend: true
            
            },
            pie: {
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '{point.percentage:.2f} %'
                },
                showInLegend: true
            }
        },
        series: series
    };
    
    
    return chartOption;
}