var selectedId;
window.pp = new pop({
    useMask: true
});

var popConfig = {
    office: ['/user/showbookmarks', '我的收藏', 600, 400],
    share: ['/viewchart/share?isDialog=1', '分享', 600, 300],
    officeadd: ['/user/editbookmarks', '添加收藏', 600, 400],
    download: ['/workspace/download?isDialog=1', '下载', 600, 300],
    login: ['/user/gologin', '登录', 600, 300]
}
var defuaultChart = {
    "A0503": "<tuxml><text>三次产业对国内生产总值增长的拉动</text><tuexpalign>0</tuexpalign><yunit_m>百分点</yunit_m><tuLabSort>0</tuLabSort><xiansortzhe>1</xiansortzhe><weicode>row</weicode><tuserials><tuserial><code>A050302</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A050303</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A050304</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial></tuserials></tuxml>",
    "A0504": "<tuxml><text>三大需求对国内生产总值增长的贡献率和拉动</text><tuexpalign>0</tuexpalign><yunit_m>百分点</yunit_m><tuLabSort>0</tuLabSort><xiansortzhe>1</xiansortzhe><weicode>row</weicode><tuserials><tuserial><code>A050402</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A050404</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A050406</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial></tuserials></tuxml>",
    "A0602": "<tuxml><text>出生率、死亡率和自然增长率</text><tuexpalign>0</tuexpalign><yunit_m>‰</yunit_m><tuLabSort>0</tuLabSort><xiansortzhe>1</xiansortzhe><weicode>row</weicode><tuserials><tuserial><code>A060201</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A060202</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A060203</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial></tuserials></tuxml>",
    "A1201": "<tuxml><text>居民消费价格指数</text><tuexpalign>0</tuexpalign><yunit_m>%</yunit_m><tuLabSort>0</tuLabSort><xiansortzhe>1</xiansortzhe><weicode>row</weicode><tuserials><tuserial><code>A120101</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A120102</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial><tuserial><code>A120103</code><tusort>2</tusort><text/><mainh>0</mainh></tuserial></tuserials></tuxml>"
};
var defuaultDispaly = {
    "A0503": {
        x: "index",
        y: "time",
        z: "region"
    },
    "A0504": {
        x: "index",
        y: "time",
        z: "region"
    },
    "A0602": {
        x: "index",
        y: "time",
        z: "region"
    },
    "A1201": {
        x: "index",
        y: "time",
        z: "region"
    }
};

function goAdv() {
    $.ajax({
        url: "/workspace/setting",
        data: {
            m: 'hgnd'
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            var params = "?m=hgnd&x=" + data.display.x + "&y=" + data.display.y + "&z=" + data.display.z + "&time=" + data.value.time + "&selectId=" + data.value.selectId;
            location.href = "/workspace/adv" + params;
        }
    });
}

function isEmpty(obj) {
    var rs = true;
    for (key in obj) {
        return false;
    }
    return rs;
}

var defuaultWidth = "340px";
function initDefuault() {
    $("#initIndexCharts").html("");
    $("#initIndexCharts").show();
    if (!isEmpty(defuaultChart)) {
        for (key in defuaultChart) {

            var chart = "<div id='chart_" + key + "' onclick='javascript:reflush(\"" + key + "\")' style=\"display:none;cursor:pointer;width:" + defuaultWidth + ";float: left;\"></div>";
            $("#initIndexCharts").append(chart);
            $.post(quotasAsyncURL + "?t=" + new Date().getTime(), {
                "dbcode": "hgndks",
                "dimension": "zb",
                "code": key,
                "level": 2
            },
            function(data) {
                if ($(data).length == 0) {
                    return;
                }

                var ids = new Array();
                var pId = data[0].pId;
                $("#chart_" + pId).show();
                $.each(data,
                function(index, item) {
                    ids.push(item.id);

                });
                var valueindex = ids;

                if ("index" == display.z) {
                    var tmp = display.x;
                    display.x = display.z;
                    display.z = tmp;
                    value.selectId = window.data.value[display.z][0].id;
                }
                getWorkspace(pId, valueindex, defuaultChart[pId], defuaultDispaly[pId]);
            });
        }
    } else if (isShare == 1) {
        reflush(value.index[0]);
    }
}

function drawImage(i, callbackArgs) {
    var len = Highcharts.charts.length;
    if (isIE() && len > i) {
        var charts = Highcharts.charts[i];
        charts.options.exporting.url = "/saveSvgImg?callback=imageLoaded&callbackArgs=" + callbackArgs + "&t=" + new Date().getTime();
        Highcharts.Chart.prototype.exportChart.call(charts);

        for (var j = 0; j < Highcharts.charts.length; j++) {
            if (!Highcharts.charts[j]) {
                Highcharts.charts.splice(j, 1);
                j--;
            }
        }
    } else {
        window[callbackArgs]();
    }
}
function imageLoaded(name, callbackArgs) {
    var img = document.createElement("img");
    img.onload = function() {
        drawImage(++window.loadedImgs, callbackArgs);
    };
    img.src = location.protocol + "//" + location.host + "/static/svgImgs/" + name + ".png";
    document.getElementById("copyImgsDiv").appendChild(img);
}
window.loginStatus = false;
function printData() {
    $.ajax({
        type: "post",
        url: '/user/checklogin?t=' + new Date().getTime(),
        async: false,
        success: function(data) {
            loginStatus = data;
        }
    });
    if (loginStatus) {
        window.loadedImgs = 0;
        document.getElementById("copyImgsDiv").innerHTML = "";
        drawImage(window.loadedImgs, "dataprintCallback");
    } else {
        showPop('login');
    }
};
function copy2Iframe(type) {
    var ifm = document.getElementById("printIfm");
    if (ifm) {
        document.body.appendChild(ifm);
    } else {
        try {
            ifm = document.createElement('<iframe id="printIfm" name="printIfm" >');
        } catch(e) {
            ifm = document.createElement('iframe');
            ifm.name = ifm.id = "printIfm";
        }
        ifm.style.width = "0px";
        ifm.style.height = "0px";
        ifm.setAttribute("frameborder", "0");
        ifm.setAttribute("scrolling", "no");
        ifm.setAttribute("marginwidth", "0");
        ifm.setAttribute("marginheight", "0");
        document.body.appendChild(ifm);
    }
    setTimeout(function() {
        var doc = ifm.contentWindow ? ifm.contentWindow.document: ifm.contentDocument ? ifm.contentDocument: ifm.document;
        if (doc) {
            var bd = doc.body;
        } else {
            var bd = (doc = ifm.documentElement).body;
        }
        var html = '<html><body>';
        html += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
        html += '<link type="text/css" href="/static/theme/global.css" rel="stylesheet" media="all" />';
        if (type === 'print') {
            html += '<div style="background:#fff;width: 100%;"><img src="/static/theme/pic/printLogo.jpg" width="240px" height="98px" /></div>';
        }
        html += '<strong>' + argsMap[display.z] + '：' + $('#regionSel option:selected').text() + '</strong>';
        html += document.getElementById("printContainer").innerHTML;
        html += '<div style="clear:both;"><strong>数据来源：国家统计局</strong></div></body></html>';
        bd.innerHTML = html;
        ifm.width = bd.style.width = document.getElementById("printContainer").clientWidth + "px";
        ifm.height = bd.style.height = "100%";
        doc.getElementById("copyImgsDiv").style.display = "block";
    },
    0);
    return ifm;
}

function dataprintCallback() {
    setTimeout(function() {
        var ifm = copy2Iframe('print');
        var doc = ifm.contentWindow ? ifm.contentWindow.document: ifm.contentDocument ? ifm.contentDocument: ifm.document;
        setTimeout(function() {
            if (isIE()) {
                $("#copyImgsDiv", doc).html(document.getElementById("copyImgsDiv").innerHTML);
                $("#initIndexCharts", doc).html("");
            }
            ifm.contentWindow.focus();
            ifm.contentWindow.focus();
            ifm.contentWindow.print();
        },
        0);
    },
    0);
}
function datacopyCallback() {
    copy2Iframe('copy');
    var doc = printIfm.document;
    setTimeout(function() {
        if (isIE()) {
            doc.getElementById("copyImgsDiv").innerHTML = document.getElementById("copyImgsDiv").innerHTML;
            doc.getElementById("initIndexCharts").innerHTML = "";
        }
        var tbs = $("table", doc);
        tbs.each(function() {
            var tb = $(this);
            tb.find(":hidden").each(function() {
                $(this).remove();
            });
            tb.find("img").each(function() {
                $(this).parent().html($(this).parent().text());
            });
            tb.find("a").each(function() {
                $(this).parent().html($(this).parent().text());
            });
        });
        printIfm.focus();
        doc.execCommand("selectall");
        doc.execCommand("copy");
        alert('复制到剪切板');
    },
    0);
}
function initClipboard() {
    ZeroClipboard.setMoviePath("/static/js/utils/ZeroClipboard.swf");
    var clip = new ZeroClipboard.Client();
    clip.setHandCursor(true);
    clip.glue("copy2Clipboard");
    $(window).resize(function() {
        clip.reposition();
    });
    clip.addEventListener("mouseDown",
    function(client) {
        $.ajax({
            type: "post",
            url: '/user/checklogin?t=' + new Date().getTime(),
            async: false,
            success: function(data) {
                loginStatus = data;
            }
        });
        if (loginStatus) {
            if (isIE()) {
                window.loadedImgs = 0;
                document.getElementById("copyImgsDiv").innerHTML = "";
                drawImage(window.loadedImgs, "datacopyCallback");
            } else {
                var text = argsMap[display.z] + '：' + $('#regionSel option:selected').text() + '\n';
                $("#printContainer").find("table:visible").each(function() {
                    $(this).find("tr:visible").each(function() {
                        $(this).children(':visible').each(function() {
                            text += $(this).text() + "\t";
                        });
                        text += "\n";
                    }) text += "\n\n";
                });
                text += '数据来源：国家统计局';
                client.setText(text);
            }
        } else {
            showPop('login');
        }
    });
    clip.addEventListener("complete",
    function() {
        if (loginStatus && !isIE()) {
            alert("复制成功");
        }
    });
};
function isIE() {
    return window.navigator.userAgent.indexOf("MSIE") >= 0;
}

var isShare = "";
var isclick = false;
var isRegionClick = false;
var nodeName = "";
function cquotasTreeOnClick(treeId, treeNode) {
    isclick = true;
    selectedId = treeNode.id;
    nodeName = treeNode.name;
    value.index = [selectedId];
    if (!treeNode.isParent || treeNode.ifData == 3) {
        $(".pdown").show();
        $("#initIndexCharts").hide();
        $.post(quotasAsyncURL + "?t=" + new Date().getTime(), {
            "dbcode": "hgndks",
            "dimension": "zb",
            "code": treeNode.id,
            "level": treeNode.level
        },
        function(data) {
            $("#timeDiv").show();
            $("#timeDiv").css("visibility", "visible");
            var ids = new Array();
            if (treeNode.ifData == 3) {
                ids.push(treeNode.id);
            }
            $.each(data,
            function(index, item) {
                ids.push(item.id);
            });
            var valueindex = ids;
            if ("index" == display.z) {
                var tmp = display.x;
                display.x = display.z;
                display.z = tmp;
                value.selectId = window.data.value[display.z][0].id;
            }
            //获取配置文件
            getChartConfig(treeNode.id, valueindex);

        });
    } else {
        quotasTree.expandNode(treeNode, !treeNode.open, false, true, true);
    }
}

function inEmpty() {
    for (obj in defuaultChart) return false;
    return true;
}
function getChartConfig(indexId, valueindex) {
    $.get('/viewchart/getchartconfig?t=' + new Date().getTime(), {
        "id": indexId,
        "m": module
    },
    function(data) {
        nodeName = data.nodeName;
        getWorkspace(indexId, valueindex, data.config, data.dispaly);

    });
}
function getParams(config) {
    var cmap = {
        office: '?isDialog=1&module=hgndks',
        officeadd: '?isDialog=1&module=hgndks'
    };
    return cmap[config] || "";
}

function showPop(config) {
    var ppc = popConfig[config];
    pp.load.call(pp, ppc[0] + getParams(config), ppc[1], ppc[2], ppc[3]);
};

function closeDialog() {
    pp && pp.close();
}

function reflush(indexId) {
    $(".pdown").show();
    $("#initIndexCharts").hide();
    isclick = true;
    selectedId = indexId;
    value.index = [selectedId];
    $.post(quotasAsyncURL + "?t=" + new Date().getTime(), {
        "dbcode": "hgndks",
        "dimension": "zb",
        "code": indexId,
        "level": 2
    },
    function(data) {
        $("#timeDiv").show();
        $("#timeDiv").css("visibility", "visible");
        var ids = new Array();
        $.each(data,
        function(index, item) {
            ids.push(item.id);
        });
        var valueindex = ids;

        getChartConfig(indexId, valueindex);

    });
}

function getWorkspace(indexId, valueindex, config, customDisplay) {
    var index = valueindex;
    var region = value.region;
    var time = value.time;
    var selectId = value.selectId;
    $.ajax({
        url: "/workspace/index?a=l&m=" + module,
        data: {
            index: index.sort().join(","),
            region: region.sort().join(","),
            time: time.sort().join(","),
            selectId: selectId,
            third: display.z
        },
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            window.data = data;
            fillTable(data, indexId, config, customDisplay); ! isRegionClick && !!data && showRegionSelect(data.value.region);
        }
    });
}
function sortTable($tb, img, trs, idx, sortColumnIndex) {
    var $img = $(img);
    var emptyTrs = [];
    for (var i = 0; i < trs.length; i++) {
        var t = $($(trs[i]).find('td')[idx]).text().replace(/,/g, '');
        if (t === '') {
            emptyTrs.push(trs[i]);
            trs.splice(i, 1);
            i--;
        }
    }
    trs.sort(function(tr1, tr2) {
        if (idx !== 0) {
            var t1 = $($(tr1).find('td')[idx]).text().replace(/,/g, '');
            var t2 = $($(tr2).find('td')[idx]).text().replace(/,/g, '');
            if (t1 === '') {
                return - 1;
            }
            if (t2 === '') {
                return 1;
            }
            return + t1 - +t2;
        } else {
            var v1 = $(tr1).find('td')[idx].id;
            var v2 = $(tr2).find('td')[idx].id;
            if (v1 > v2) {
                return 1;
            } else if (v1 < v2) {
                return - 1;
            }
            return 0;
        }
    });
    if (sortColumnIndex === idx) {
        if ($img.hasClass('asc')) {
            trs.reverse();
            $img.removeClass('default asc').addClass('desc');
            img.src = "/static/theme/pic/icon_drop.jpg";
        } else {
            $img.removeClass('default desc').addClass('asc');
            img.src = "/static/theme/pic/icon_default.jpg";
        }
    } else {
        sortColumnIndex = idx;
        img.src = "/static/theme/pic/icon_default.jpg";
        $img.removeClass('default desc').addClass('asc');
    }
    $tb.find('tbody').append(trs);
    $tb.find('tbody').append(emptyTrs);
};

function initSortColumns($tb) {
    var sortColumnIndex = 0;
    var sortColumns = $('.sort-column', $tb.find('thead'));
    sortColumns.each(function() {
        var th = this.parentNode;
        this.onclick = function() {
            var thead = $tb.find('thead');
            var ths = $('th:visible', thead);
            var trs = $tb.find('tbody tr:visible');
            var trsArr = [];
            trs.each(function() {
                trsArr.push(this);
            });
            ths.each(function(i) {
                if (this === th) {
                    sortTable($tb, sortColumns[i], trsArr, i, sortColumnIndex);
                    sortColumnIndex = i;
                } else {
                    $(this).find('img.sort-column').removeClass('desc asc').addClass('default').attr("src", "/static/theme/pic/icon_sequence.jpg");
                }
            })
        };
    });
};

function trimTable(tabid) {
    var ths = $("#" + tabid + " thead tr th");
    var trs = $("#" + tabid + " tbody tr");
    //去除空列
    var tempArr = [];
    for (var i = 1; i < ths.length; i++) {
        tempArr[i] = i;
    }
    var visibleLines = 0;
    trs.each(function() {
        var tds = $(this).find('td');
        var nextArr = [];
        for (var i = 0,
        len = tempArr.length; i < len; i++) {
            var idx = tempArr[i];
            if ($.trim($(tds[idx]).text()) === '') {
                nextArr.push(idx);
            }
        }
        tempArr = nextArr;
        var flg = false;
        tds.each(function(i) {
            if (i && $.trim($(this).text()) !== '') {
                flg = true;
                return false;
            }
        });
        if (!flg) {
            $(this).addClass("empty");
        } else {
            visibleLines++;
        }
    });
    var len = tempArr.length;
    for (var i = 0; i < len; i++) {
        var idx = tempArr[i];
        $(ths[idx]).addClass("empty");
        trs.each(function() {
            var tds = $(this).find('td');
            $(tds[idx]).addClass("empty");
        });
    }

    $(".empty").remove();
};

function fillTable(data, index, config, customDisplay) {
    var x = display.x;
    var y = display.y;
    var z = display.z;

    if (customDisplay) {
        if (customDisplay.x != "null" && customDisplay.y != "null" && customDisplay.z != "null") {
            x = customDisplay.x;
            y = customDisplay.y;
            z = customDisplay.z;
        }
    }

    var selectId = value.selectId;
    var tableData = data.tableData;
    var axis = data.value;
    var table = "<table width='100%' border='0' cellspacing='0' cellpadding='0' id='table_" + index + "'>";
    var thead = "<thead><tr><th>" + argsMap[x] + "<img class='sort-column'  src=/static/theme/pic/icon_default.jpg /></th>";
    for (var i = 0; i < axis[y].length; i++) {
        thead += "<th id='" + axis[y][i].id + "' class='talignR'>";
        if (y == "index") {
            thead += "<a href=\"javascript:showTip('" + axis[y][i].id + "');\"><img border='0' src=\"/static/theme/pic/icon_info.gif\" /></a>" + axis[y][i].name;
            if (null != axis[y][i].unit && "" != axis[y][i].unit) {
                thead += "(" + axis[y][i].unit + ")";
            }
        } else if (y == "time") {
            //thead += formatTime(axis[y][i].name, timeMap[module]);
            thead += formatTime(axis[y][i].name, dateFormatLocale);
        } else {
            thead += axis[y][i].name;
        }
        thead += "<img class='sort-column'  src=/static/theme/pic/icon_sequence.jpg /></th>";
    }
    thead += "</thead>";
    table += thead;
    var tbody = "<tbody>";
    var keyArr = [];
    var xOffset = vdoing[x];
    var yOffset = vdoing[y];
    var zOffset = vdoing[z];
    for (var i = 0; i < axis[x].length; i++) {
        var xId = axis[x][i].id;
        tbody += "<tr><td id='" + axis[x][i].id + "' >";
        if (x == "index") {
            tbody += "<a href=\"javascript:showTip('" + axis[x][i].id + "');\"><img border='0' src=\"/static/theme/pic/icon_info.gif\" />" + axis[x][i].name;
            if (null != axis[x][i].unit && "" != axis[x][i].unit) {
                tbody += "(" + axis[x][i].unit + ")";
            }
            tbody += "</a>";
        } else if (x == "time") {
            //tbody += formatTime(axis[x][i].name, timeMap[module]);
            tbody += formatTime(axis[x][i].name, dateFormatLocale);
        } else {
            tbody += axis[x][i].name;
        }
        tbody += "</td>";
        for (var j = 0; j < axis[y].length; j++) {
            var yId = axis[y][j].id;
            keyArr[xOffset] = xId;
            keyArr[yOffset] = yId;
            keyArr[zOffset] = selectId;
            var td = tableData[keyArr.join("_")];
            if (td === undefined) {
                td = "";
                tableData[keyArr.join("_")] = "";
            }
            tbody += "<td class='talignR'>" + td + "</td>";
        }
        tbody += "</tr>";
    }
    tbody += "</tbody>";
    table += tbody + "</table>";

    if (isclick || isShare == "1") {
        $(".pdown").show();
        $("#timeDiv").show();
        $("#timeDiv").css("visibility", "visible");
        destroyChart();
        table = "<div onclick=\"displayControl('#tbimage','#table_" + index + "')\"><img id=\"tbimage\" src=\"/static/img/hide02.gif\">" + nodeName + "</img></div>" + table;
        $("#dataTb").html(table).show();
    } else {
        $("#dataTb").append(table).hide();
    }

    var tbnode = document.getElementById("dataTb");
    var tbheight = document.getElementById("table_" + index).clientHeight;
    if (tbheight > 300) {
        tbnode.style.height = tbheight + 40 + "px";
    } else {
        tbnode.style.height = "340px";
    }
    trimTable("table_" + index);
    initSortColumns($("#dataTb"));
    fillchart(index, config, {
        "x": x,
        "y": y,
        "z": z
    });

}

function displayControl(img, id) {
    if ($(id).is(":visible")) {

        $(id).hide();
        $(img).attr("src", "/static/img/hide01.gif");
    } else {
        $(id).show();
        $(img).attr("src", "/static/img/hide02.gif");
    }
}
function fillchart(indexId, xmlconfig, customDisplay) {

    if (isclick || isShare == "1") {
        $("#initIndexCharts").html("");
    }

    if (xmlconfig != undefined) {
        var xotree = new XML.ObjTree();
        var config = xotree.parseXML(xmlconfig);
        //判断是否需要排序时间
        var issort = false;
        var temptype = {
            "row": "y",
            "col": "x"
        };
        $(config.tuxml.tuserials.tuserial).each(function(index, val) {

            if (val.tusort == 1 || val.tusort == 2) {
                config.tuxml["xLableRotation"] = -45;
            }
            if (val.tusort == 1 || val.tusort == 2 || val.tusort == 4) {

                if (customDisplay[temptype[config.tuxml.weicode]] == "time") issort = true;
                return false;
            }
        });

        if (isclick || isShare == "1") {
            var chart = "<div  id='chart_" + indexId + "' ></div>";
            chart = "<div onclick=\"displayControl('#chartimg','#chart_" + indexId + "')\" style=\"cursor:pointer;\"><img id=\"chartimg\" src=\"/static/img/hide02.gif\">" + config.tuxml.text + "</img></div>" + chart;
            $("#initIndexCharts").html(chart).show();
        }
        $('#chart_' + indexId).chartCreater(config, "table_" + indexId, getTable("table_" + indexId, issort, customDisplay));

        if (isclick || isShare == "1") {
            if ($('#chart_' + indexId).html() == "") {
                $("#initIndexCharts").hide();
            }
        } else {
            if ($('#chart_' + indexId).html() == "没有数据无法作图" || $('#chart_' + indexId).html() == "") {
                $('#chart_' + indexId).hide();
            }

            //添加单击标题事件
            //判断是否是ie
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (window.ActiveXObject) Sys.ie = ua.match(/msie ([\d.]+)/)[1];

            if (Sys.ie == "6.0" || Sys.ie == "8.0" || Sys.ie == "7.0") {
                if ($("#chart_" + indexId + " .highcharts-container>div>span").length > 0) {
                    setTimeout(function() {
                        $("#chart_" + indexId + " .highcharts-container").click(function() {
                            reflush(indexId);
                        });
                    },
                    1);
                }
            } else {

                $("#chart_" + indexId + " .highcharts-title,#chart_" + indexId + " svg>rect").click(function() {
                    reflush(indexId);
                });

            }
        }

    }

}

var types = {
    "col": "y",
    "row": "x"
};

function getTable(tableName, sorttime, customDisplay) {

    var rows = [];
    var cols = [];
    $("#" + tableName + " tbody tr").each(function(index, val) { //遍历列数据
        rows.push({
            "id": val.cells[0].id,
            "name": val.cells[0].innerHTML.replace(/<[^>].*?>/g, ""),
            "index": index
        });
    });
    $("#" + tableName + " thead tr th").each(function(index, val) { //遍历行数据
        if (index != 0) cols.push({
            "id": val.id,
            "name": val.innerHTML.replace(/<[^>].*?>/g, ""),
            "index": index,
            "type": "col"
        });
    });

    var table = {
        "row": rows,
        "col": cols
    };
    if (sorttime) {

        if (customDisplay[types.col] == "time") {
            table.col.sort(function(x, y) {
                if (x.id > y.id) {
                    return 1;
                } else if (x.id == y.id) {
                    return 0;
                } else {
                    return - 1;
                }
            });
        } else if (customDisplay[types.row] == "time") {

            table.row.sort(function(x, y) {
                if (x.id > y.id) {
                    return 1;
                } else if (x.id == y.id) {
                    return 0;
                } else {
                    return - 1;
                }
            });
        }

    }
    return table;
}

function timeInit() {
    $("#timeDiv").hide();
    $("#timeStart").html("");
    $("#timeEnd").html("");
    $("#timeStart").unbind("change");
    $("#timeEnd").unbind("change");
    $.get('/time/init?t=' + new Date().getTime(), {
        "dbcode": module,
        "dimension": "sj"
    },
    function(data) {
        if (data != null) {
            var type = timeMap[module];
            if (type != "y") {
                if (document.getElementById("timeStart1")) {
                    $("#timeStart1").html("");
                    $("#timeEnd1").html("");
                    $("#timeStart1").unbind("change");
                    $("#timeEnd1").unbind("change");
                } else {
                    $("#timeStart").after('<select name="timeStart1" id="timeStart1"></select>');
                    $("#timeEnd").after('<select name="timeEnd1" id="timeEnd1"></select>');
                }
            }

            if (value.time[0] == '-1') {
                var tmpt = value.time[1];
                value.time[1] = value.time[0];
                value.time[0] = tmpt;
            }

            var times = [];
            for (var i = 0; i < data.length; i++) {
                times[i] = data[i].name;
            }
            times.sort();
            if (type == "y") {
                var isStartIn = false;
                for (var i = 0; i < times.length; i++) {
                    $("#timeStart").prepend('<option value="' + times[i] + '">' + '' + times[i] + '年' + '</option>');
                    $("#timeEnd").prepend('<option value="' + times[i] + '">' + '' + times[i] + '年' + '</option>');
                    if (times[i] == value.time[0]) {
                        isStartIn = true;
                    }
                }
                $("#timeEnd").prepend('<option value="-1">至今</option>');
                if (isStartIn) {
                    $("#timeStart").ie6val(value.time[0]);
                } else {
                    $("#timeStart").ie6val(times[times.length - 1]);
                }
                $("#timeEnd").ie6val(value.time[1]);

                $("#timeStart").change(function() {
                    var timeEnd = $("#timeEnd").val();
                    $("#timeEnd").html("");
                    for (var i = 0; i < times.length; i++) {

                        if (times[i] >= this.value) {
                            $("#timeEnd").prepend('<option value="' + times[i] + '">' + '' + times[i] + '年' + '</option>');
                        }
                    }
                    $("#timeEnd").prepend('<option value="-1">至今</option>');
                    $("#timeEnd").ie6val(this.value > timeEnd && timeEnd != "-1" ? this.value: timeEnd);
                });

                setTimeout(function() {
                    $("#timeStart").change();
                },
                0);
            }

            if (type == "m") {
                var minTime = times[0];
                var maxTime = times[times.length - 1];

                var minYear = Number(minTime.substring(0, 4));
                var maxYear = Number(maxTime.substring(0, 4));
                var minMonth = Number(minTime.substring(4));
                var maxMonth = Number(maxTime.substring(4));

                for (var i = minYear; i <= maxYear; i++) {
                    $("#timeStart").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                    $("#timeEnd").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                }
                $("#timeEnd").prepend('<option value="-1">至今</option>');
                for (var i = 1; i <= 12; i++) {
                    $("#timeStart1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                    $("#timeEnd1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                }
                $("#timeStart").ie6val(value.time[0].substring(0, 4));
                $("#timeStart1").ie6val(Number(value.time[0].substring(4)));
                if (value.time[1] == -1) {
                    $("#timeEnd").ie6val(value.time[1]);
                    $("#timeEnd1").hide();
                } else {
                    $("#timeEnd").ie6val(value.time[1].substring(0, 4));
                    $("#timeEnd1").ie6val(Number(value.time[1].substring(4)));
                }

                $("#timeStart").change(function() {
                    var monthStart = $("#timeStart1").val();
                    $("#timeStart1").html("");
                    if (this.value == minYear) {
                        for (var i = minMonth; i <= 12; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                        }
                        $("#timeStart1").ie6val(minMonth > monthStart ? minMonth: monthStart);
                    } else if (this.value == maxYear) {
                        for (var i = 1; i <= maxMonth; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                        }
                        $("#timeStart1").ie6val(maxMonth > monthStart ? monthStart: maxMonth);
                    } else {
                        for (var i = 1; i <= 12; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                        }
                        $("#timeStart1").ie6val(monthStart);
                    }

                    var yearEnd = $("#timeEnd").val();
                    $("#timeEnd").html("");
                    for (var i = this.value; i <= maxYear; i++) {
                        $("#timeEnd").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                    }
                    $("#timeEnd").prepend('<option value="-1">至今</option>');
                    $("#timeEnd").ie6val(this.value > yearEnd && yearEnd != "-1" ? this.value: yearEnd);
                    setTimeout(function() {
                        $("#timeEnd").change();
                    },
                    0);

                });

                $("#timeStart1").change(function() {
                    var monthEnd = $("#timeEnd1").val();
                    if ($("#timeStart").val() == $("#timeEnd").val()) {
                        $("#timeEnd1").html("");
                        for (var i = Number(this.value); i <= Number($(this).find("option:last").val()); i++) {
                            $("#timeEnd1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                        }
                        $("#timeEnd1").ie6val(Number(this.value) > Number(monthEnd) ? this.value: monthEnd);
                    }
                });

                $("#timeEnd").change(function() {
                    if ($(this).val() == -1) {
                        $("#timeEnd1").hide();
                    } else {
                        $("#timeEnd1").show();
                        var monthEnd = $("#timeEnd1").val();
                        if (this.value == $("#timeStart").val()) {
                            $("#timeStart1").change();
                        } else if (this.value == minYear) {
                            $("#timeEnd1").html("");
                            for (var i = minMonth; i <= 12; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                            }
                            $("#timeEnd1").ie6val(minMonth > monthEnd ? minMonth: monthEnd);
                        } else if (this.value == maxYear) {
                            $("#timeEnd1").html("");
                            for (var i = 1; i <= maxMonth; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                            }
                            $("#timeEnd1").ie6val(maxMonth > monthEnd ? monthEnd: maxMonth);
                        } else {
                            $("#timeEnd1").html("");
                            for (var i = 1; i <= 12; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + dateFormatLocale.monthArr[i] + '</option>');
                            }
                            $("#timeEnd1").ie6val(monthEnd);
                        }
                    }
                });
                setTimeout(function() {
                    $("#timeStart").change();
                },
                0);

            }

            if (type == "q") {
                var minTime = times[0];
                var maxTime = times[times.length - 1];

                var minYear = Number(minTime.substring(0, 4));
                var maxYear = Number(maxTime.substring(0, 4));
                var minQuarter = swapQuarterReverse(minTime.substring(4));
                var maxQuarter = swapQuarterReverse(maxTime.substring(4));

                for (var i = minYear; i <= maxYear; i++) {
                    $("#timeStart").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                    $("#timeEnd").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                }
                $("#timeEnd").prepend('<option value="-1">至今</option>');
                for (var i = 1; i <= 4; i++) {;
                    $("#timeStart1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                    $("#timeEnd1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                }
                $("#timeStart").ie6val(value.time[0].substring(0, 4));
                $("#timeStart1").ie6val(swapQuarterReverse(value.time[0].substring(4)));
                if (value.time[1] == -1) {
                    $("#timeEnd").ie6val(value.time[1]);
                    $("#timeEnd1").hide();
                } else {
                    $("#timeEnd").ie6val(value.time[1].substring(0, 4));
                    $("#timeEnd1").ie6val(swapQuarterReverse(value.time[1].substring(4)));
                }

                $("#timeStart").change(function() {
                    var quarterStart = $("#timeStart1").val();
                    $("#timeStart1").html("");
                    if (this.value == minYear) {
                        for (var i = minQuarter; i <= 4; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                        }
                        $("#timeStart1").ie6val(minQuarter > quarterStart ? minQuarter: quarterStart);
                    } else if (this.value == maxYear) {
                        for (var i = 1; i <= maxQuarter; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                        }
                        $("#timeStart1").ie6val(maxQuarter > quarterStart ? quarterStart: maxQuarter);
                    } else {
                        for (var i = 1; i <= 4; i++) {
                            $("#timeStart1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                        }
                        $("#timeStart1").ie6val(quarterStart);
                    }

                    var yearEnd = $("#timeEnd").val();
                    $("#timeEnd").html("");
                    for (var i = this.value; i <= maxYear; i++) {
                        $("#timeEnd").prepend('<option value="' + i + '">' + '' + i + '年' + '</option>');
                    }
                    $("#timeEnd").prepend('<option value="-1">至今</option>');
                    $("#timeEnd").ie6val(this.value > yearEnd && yearEnd != "-1" ? this.value: yearEnd);

                    setTimeout(function() {
                        $("#timeEnd").change();
                    },
                    0);
                });

                $("#timeStart1").change(function() {
                    var quarterEnd = $("#timeEnd1").val();
                    if ($("#timeStart").val() == $("#timeEnd").val()) {
                        $("#timeEnd1").html("");
                        for (var i = Number(this.value); i <= Number($(this).find("option:last").val()); i++) {
                            $("#timeEnd1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                        }
                        $("#timeEnd1").ie6val(this.value > quarterEnd ? this.value: quarterEnd);
                    }
                });

                $("#timeEnd").change(function() {
                    if ($(this).val() == -1) {
                        $("#timeEnd1").hide();
                    } else {
                        $("#timeEnd1").show();
                        var quarterEnd = $("#timeEnd1").val();
                        if (this.value == $("#timeStart").val()) {
                            $("#timeStart1").change();
                        } else if (this.value == minYear) {
                            $("#timeEnd1").html("");
                            for (var i = minQuarter; i <= 4; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                            }
                            $("#timeEnd1").ie6val(minQuarter > quarterEnd ? minQuarter: quarterEnd);
                        } else if (this.value == maxYear) {
                            $("#timeEnd1").html("");
                            for (var i = 1; i <= maxQuarter; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                            }
                            $("#timeEnd1").ie6val(maxQuarter > quarterEnd ? quarterEnd: maxQuarter);
                        } else {
                            $("#timeEnd1").html("");
                            for (var i = 1; i <= 4; i++) {
                                $("#timeEnd1").append('<option value="' + i + '">' + '第' + i + '季度' + '</option>');
                            }
                            $("#timeEnd1").ie6val(quarterEnd);
                        }
                    }
                });
                setTimeout(function() {
                    $("#timeStart").change();
                },
                0);

            }
        }
    });
}

function showTip(code) {
    pp.load('/workspace/expindex?code=' + code + '&dbcode=' + module, '指标解释', 600, 300);
}

function destroyChart() {
    for (var i = 0; i < Highcharts.charts.length; i++) {
        var chart = Highcharts.charts[i];
        if (chart) {
            chart.destroy();
        }
    }
    Highcharts.charts.length = 0;
};

function onRegionSelect() {
    isRegionClick = true;
    if ("region" == display.z) {
        value.selectId = $("#regionSel").val();
    }
    if (value.index[0] != -1) {
        reflush(value.index[0]);
    }
}

function showRegionSelect(data, value) {
    $("#regionSel").html('');
    value = window.value.selectId;
    $.each(data,
    function(index, item) {
        if (( !! value && value == item.id) || index == 0) {
            $("#regionSel").append('<option selected value="' + item.id + '">' + item.name + '</option>');
        } else {
            $("#regionSel").append('<option value="' + item.id + '">' + item.name + '</option>');
        }
    });
}

function cregionTreeOnClick(treeId, treeNode) {
    if (!treeNode.isParent) {
        isRegionClick = true;
        if (isclick) {
            $.get(regionAsyncURL + "?t=" + new Date().getTime(), {
                "dimension": "reg",
                "code": treeNode.id,
                "dbcode": "hgndks"
            },
            function(data) {
                showRegionSelect(data);
                value.region = [data[0].id];
                var arr = [];
                if ("region" == display.z) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        arr.push(obj.id);
                    }
                    value.region = arr;
                    value.selectId = data[0].id;
                }
                if (value.index[0] != -1) {
                    reflush(value.index[0]);
                }
            });
        };
    } else {
        regionTree.expandNode(treeNode, !treeNode.open, false, false, true);
    }
}

function showRegion() {
    if (module.indexOf('fs') > -1 || module.indexOf('cs') > -1) {
        regionInit();
    } else {
        $("#regionTitle").hide();
        $("#regionTreeDiv").hide();
        document.getElementById("leftSwitchDiv").style.height = document.getElementById("main_contentDiv").clientHeight + "px";
        document.getElementById("rightSwitchDiv").style.height = document.getElementById("main_contentDiv").clientHeight + "px";
    }
}

$(function() {
    initClipboard();
    timeInit();
    showRegion();
    initDefuault();
    $(".pdown").hide();
    $('#timeDiv').bgiframe();
    $("#timeDiv").hide();
    $("#dataTb").hide();
    $("#search").click(function() {
        $("#initIndexCharts").hide();
        $("#timeDiv").show();
        $("#timeDiv").css("visibility", "visible");
        $("#dataTb").show();
        var start = $("#timeStart").val();
        var end = $("#timeEnd").val();
        var type = timeMap[module];
        if ("m" == type) {
            var monthStart = $("#timeStart1").val();
            if (monthStart < 10) {
                monthStart = "0" + monthStart;
            }
            start += monthStart;
            if (end != -1) {
                var monthEnd = $("#timeEnd1").val();
                if (monthEnd < 10) {
                    monthEnd = "0" + monthEnd;
                }
                end += monthEnd;
            }
        }
        if ("q" == type) {
            var quarterStart = $("#timeStart1").val();
            start += swapQuarter(quarterStart);
            if (end != -1) {
                var quarterEnd = $("#timeEnd1").val();
                end += swapQuarter(quarterEnd);
            }
        }
        value.time[0] = start;
        value.time[1] = end; ! selectedId && (selectedId = value.index[0]);
        reflush(selectedId);
    });
});

function loadDownloadPop() {
    if ( !! selectedId || isShare == "1") {
        showPop("download");
    }
}

function downloadData(type, randvalue) {
    var selectedName = $('#regionSel option:selected').text();
    var datas = [];
    $("#table_" + selectedId + " tr").each(function() {
        var data = [];
        $(this).children().each(function() {
            data.push($(this).text().replace(/,/g, ''));
        });
        datas.push(data);
    });
    var notes = [];
    $("#noteDiv").find("div").each(function() {
        notes.push(this.innerHTML);
    });
    $("#fileData").val(JSON.stringify(datas));
    $("#type").val(type);
    $("#display").val(JSON.stringify(display));
    $("#selectedName").val(selectedName);
    $("#dataType").val("hgndks");
    $("#notes").val(JSON.stringify(notes));
    $("#download_rand").val(randvalue);
    $("#downloadDataForm").submit();
}