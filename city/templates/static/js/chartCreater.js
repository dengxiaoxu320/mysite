
(function($) {
	var colors = [
      '#a90329',
      //'#ffff88',
      '#64b6db',
      '#c3dfa4',
      '#e670e8',
      
      '#ff1a00',
      //"#f8b500",
      '#6a85b6',
      '#9bbb50',
      '#fc85fb',
      
      "#ea5506",
      //'#f8bb49',
      '#02b0e6',
      '#cdeb8b',
      "#d572a5",
      
      '#ff6600',
      //"#ef8d31",
      '#65b6fc',
      '#b8db57',
      '#d659ad',
      
      '#f72a0c',
      //"#ffaf4b",
      '#7ec4d8',
      '#8ac000',
      '#bf89b3',
      
      '#ff5b5c',
      //"#ed9017",
      '#6090bf',
      '#7ca365',
      '#fd8ad7',
      
      '#ff1a00',
      //"#ff7400",
      '#7faaca',
      '#a4c855',
      '#c4c1ea',
      
      '#ef6e6e',
      //"#ffd65e",
      '#7fe0f8',
      '#d1d35f',
      '#8989ba'
    ];
	
	var columnColor = colors.slice(1).concat(colors.slice(0, 1));
	var lineColor = colors.slice(8).concat(colors.slice(0, 8));
	var pieColor = colors.slice(0);
	var barColor = colors.slice(17).concat(colors.slice(0, 17));
	
$.fn.chartCreater = function(config,tableId,newtable)
{
	var series = [];
    var table = [];
    var type = "";
    var xType ="";
    var charttypes = [];
    
    table = newtable;
    
	if(newtable == null)	
		initTable();
    
	initConfig();
	
	var chartconfig = createHighchart();
	
	sortBarData();
	if(getvalidSeriescount() > 0){
		
		if(getvalidSeriesNULLcount() > 0)
			{
			this.highcharts(chartconfig); 
			}else
				{
				this.html("没有数据无法作图");
				
				}
		}
	   else
	   {
		   this.html("");
	   }
	function getSeriesIndexByName(name)
	{
		var seriesindex = 0;
		$(chartconfig.series).each(function(index,val){
			if(val.name == name)
				{
					seriesindex = index;
				}
		});
		return seriesindex;
	}
	function sortBarData()
	{
		 
		var seriesindex = 0;
		
		if(getvalidSeriescount() == 0 )
			return;
		if(chartconfig.series[0].type != "bar")
			return;
		
		delete chartconfig.xAxis[0]["labels"].y;
		
		
		seriesindex = chartconfig.series.length - 1;
		chartconfig.legend.reversed = 1;
		
		
		var tmpseries = [];
		$(chartconfig.series).each(function(index,val){
			
			var tmparry = [];
				$(chartconfig.xAxis[0].categories).each(function(index1,val1){
					var o  = {};
					o[chartconfig.xAxis[0].categories[index1]] = chartconfig.series[index].data[index1];
					o["index"] = index1;
					tmparry.push(o);
				});
				tmpseries.push(tmparry);
		});
		tmpseries[seriesindex].sort(function (x,y){
			var key1 = "";
			var key2 = ""; 
				for(key in x)
			    {
					key1 = key;
					break;
				}
				for(key in y)
			    {
					key2 = key;
					break;
				}
			 if(x[key1] > y[key2])
             {
             	return -1;
             }else if(x[key1] == y[key2])
             {
             	return 0;
             }else
             {
             	return 1;
             }
	  		});
		
		//获取顺序
		var sortarry = [];
		for(var x = 0; x<tmpseries[seriesindex].length; x++)
		{
			sortarry.push(tmpseries[seriesindex][x].index);
		}
		
		
		$(tmpseries).each(function(index,val)
			{
				var tmp =[];
				if(index != seriesindex)
					{
						$(sortarry).each(function(index1,val1)
							{
							  tmp.push(val[val1]);
							}	
						);
						tmpseries[index].length = 0;
						tmpseries[index]  = tmp;
						
					}
			}		
		);

		chartconfig.xAxis[0].categories.length = 0;
		chartconfig.series[0].data.length = 0;
		
		//组装
		$(tmpseries).each(function(index,val){
			var data = [];
			$(val).each(function(index1,val1){
				for(key in val1)
				{
					if(key != "index")
						{
							chartconfig.xAxis[0].categories.push(key);
							data.push(val1[key]);
						}
				}
			});
			chartconfig.series[index].data = data;
		});
		
	
	}
	
	
	
	
	function jsonToString (obj){   
        var THIS = this;    
        switch(typeof(obj)){   
            case 'string':   
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';   
            case 'array':   
                return '[' + obj.map(jsonToString).join(',') + ']';   
            case 'object':   
                 if(obj instanceof Array){   
                    var strArr = [];   
                    var len = obj.length;   
                    for(var i=0; i<len; i++){   
                        strArr.push(jsonToString(obj[i]));   
                    }   
                    return '[' + strArr.join(',') + ']';   
                }else if(obj==null){   
                    return 'null';   
  
                }else{   
                    var string = [];   
                    for (var property in obj) string.push(jsonToString(property) + ':' + jsonToString(obj[property]));   
                    return '{' + string.join(',') + '}';   
                }   
            case 'number':   
                return obj;   
            case false:   
                return obj;   
        }   
    }

	function getvalidSeriescount()
	{
		var count = 0;
		$(chartconfig.series).each(function(index,val){//遍历列数据
			   
			   if(val.data.length != 0)
				   count ++;
		});
		return count;
	}
	//得到null值数量
	function getvalidSeriesNULLcount()
	{
		
		var count = 0;

					$(chartconfig.series).each(function(index,val){
						   
						if(val.type == "pie")
							{
								$(val.data).each(function(datainde,dataval){
									
									  if(dataval[1] != null)
										  count ++;
								});
							}else if(val.type == "line" || val.type == "column" || val.type == "spline"|| val.type == "bar" )
								{
									
									$(val.data).each(function(datainde,dataval){
										
										
										  if(dataval != null)
											  count ++; 	
									});
								}
							else if(val.type == "scatter" )
								{
								
									$(val.data).each(function(datainde,dataval){
										
										  if(dataval[0] != null && dataval[1] != null)
											  count ++;
									});
								}
					        else
								{
								count ++;
								}		
					});
		return count;
	}
	
	
	function initConfig()
	{
		
		
 		if(config.tuxml.weicode == "row")
 		{
 			xType = "col";

 		}else
 		{
 			xType = "row";

 		}


		charttypes["1"]="column";
		charttypes["2"]="spline";
		charttypes["3"]="pie";
		charttypes["4"]="bar";
		charttypes["5"]="scatter";
		

		initSeries();
	}
	
	function initTable()
	{	

		var rows = [];
		var cols = [];
		
		
     $("#"+tableId+" tbody tr:visible").each(function(index,val){//遍历列数据
     		rows.push({"id" : val.cells[0].id, "name":val.cells[0].innerHTML,"index":index});
		});
	 $("#"+tableId+" thead tr th:visible").each(function(index,val){//遍历行数据
	 	if(index != 0)
     		cols.push({"id" : val.id,"name":val.innerHTML,"index":index,"type":"col"});
		});
	  table = {"row":rows,"col":cols};
	}
	

	 function getData(rowIndex,colIndex)
	 {
		 	var data = 0;
		 	var visible = ":visible"; 
			if(!$("#" + tableId).is(":visible"))
			{
				visible = ""; 
			}
			var value = $("#"+tableId+" tbody tr"+visible).eq(rowIndex ).find("td"+visible).eq(colIndex)[0].innerHTML;
			if(value == '')
				return null;
		 	data = toFloat(value);
	 	 return data;
	 }

	 function getObjById(type,id)
	 {
	 	 var obj = null;
 		 $(table[type]).each(function(index,value){

		 		if(id == value.id)
		 		{
		 			obj = value;
		 			return false;
		 		}	

		 	});			 
		 	return obj;
	 }

 	function createScatterSeriesData(xvalue,xId,yId)
	 {
			 var data = [];
			 	//得到 x y的索引
			 	var xObj = getObjById(config.tuxml.weicode,xId);
			 	var yObj = getObjById(config.tuxml.weicode,yId);
			 	if(xObj != null && yObj != null)
			 		{
				 		if(config.tuxml.weicode == "row")
				 		{
				 		    data.push([getData(xObj.index,xvalue.index),getData(yObj.index,xvalue.index)]);
	
				 		}else if(config.tuxml.weicode == "col")
				 		{
				 			data.push([getData(xvalue.index,xObj.index),getData(xvalue.index,yObj.index)]);
				 		}
				 		if(data[0][0] == null || data[0][1] == null)
						{
							data[0][0] = null;
							data[0][1] = null;
						}
			 		}
		return data;
	}


	function initSeries()
	{
		var columnOffset = 0, lineOffset = 0, pieOffset = 0, barOffset = 0;
					if(config.tuxml.tuserials.tuserial[0] == undefined)
					{
						config.tuxml.tuserials.tuserial = [config.tuxml.tuserials.tuserial];
					}
					if(charttypes[ config.tuxml.tuserials.tuserial[0].tusort] == "scatter")
						 {
						 	type = "scatter";

						 	$(table[xType]).each(function(xindex,xvalue){

						 		var xId = config.tuxml.tuserials.tuserial[0].code;
						 		var yId = config.tuxml.tuserials.tuserial[1].code;
						 	 	var xObj = getObjById(config.tuxml.weicode,xId);
							 	var yObj = getObjById(config.tuxml.weicode,yId);
							 	var s = {
									"name":xvalue.name,
									"type":"scatter",
									"data":createScatterSeriesData(xvalue,xId,yId)
									};
									series.push(s);
							});
						 }else
						 {
					  		$(config.tuxml.tuserials.tuserial).each(function(seriesindex,seriesvalue){
					  			
											 	var seriesval = getObjById(config.tuxml.weicode,seriesvalue.code);
											 	var bar_index = config.tuxml.tuserials.tuserial.length - 1 - seriesindex;
												var s = {};
										 		var type = charttypes[seriesvalue.tusort];
										 		if(type == "bar")
										 		{
										 			seriesval = getObjById(config.tuxml.weicode,config.tuxml.tuserials.tuserial[bar_index].code);
										 		}
										 		
											 	if(seriesval != null)
											 	{
											 	
											 		var color = seriesvalue.color;
											 		if(!color){
											 			switch(type){
											 			case "column" :
											 				color = columnColor[columnOffset++];
											 				break;
											 			case "line" :
											 				color = lineColor[lineOffset++];
											 				break;
											 			case "pie" :
											 				color = pieColor[pieOffset++];
											 				break;
											 			case "bar" :
											 				color = barColor[ config.tuxml.tuserials.tuserial.length - 1 - barOffset++ ];
											 				break;
											 			}
											 		}
										 			if(type == "bar")
										 			{
										 					s = {
																name:seriesval.name,
																id: config.tuxml.tuserials.tuserial[bar_index].code,
																type: charttypes[config.tuxml.tuserials.tuserial[bar_index].tusort],
																color: color,
																data:createSeriesData(config.tuxml.tuserials.tuserial[bar_index])
															};
										 			}else
									 				{
										 					s = {
																name:seriesval.name,
																id: seriesvalue.code,
																type: type,
																color: color,
																data:createSeriesData(seriesvalue)
																};
									 				}
													if(seriesvalue.text != undefined)
													{
														s["name"] = seriesvalue.text;
													}
													if(seriesvalue.mainh != undefined)
													{
														s["yAxis"] = toFloat(seriesvalue.mainh);
													}
													series.push(s);	
													//始终将column类型放入第一位，防止线被覆盖
//													if(s.type == "column")
//													{
//														series.splice(0,0,s);
//													}else{
//														series.push(s);	
//													}
											 		
											 	}
							 	});

						 }
	}


	function createxAxis()
	{
		var xAxis = [{
            	labels:{ y:10,step:config.tuxml.xStep,rotation:config.tuxml.xLableRotation,
            		formatter:function()
                    { 
                    	return subchartstr(this.value,9);  
                    }
            	}         
            }]; 
            if(type != "scatter")
            {
            	xAxis[0]["categories"] =  createCategories();
            	xAxis[0]["labels"].y = 30;
            	if(config.tuxml.tuserials.tuserial[0].tusort == 4)
            		{
            			xAxis[0]["labels"].formatter = function(){return subchartstr(this.value,20)};
            		}
            }else
            {
            	var xobj = getObjById(config.tuxml.weicode,config.tuxml.tuserials.tuserial[0].code);
            	if(xobj != null)
            		xAxis[0]["title"] ={"enabled":true,text:xobj.name};
            }

            return xAxis;
	}



	//创建X轴createCategories
	function createCategories()
	{
		var categories = [];

		$(table[xType]).each(function(key,xval){ 
				categories.push(xval.name);
		});
		return categories;
	}
	
	
	function subchartstr(str,size)
	{ 
		var result = str;
		if(str)
			{
				if(str.length > size)
					{
					 result = str.substr(0,size) +"...";
					}
			}
		return result;
	}

	

	//创建Y轴
	function createyAxis()
	{
		var yAxis = [{ 
	                labels: {
	               		formatter:function() {
	                  	  return this.value; 
      					 },
	                    style: {
	                        color: '#89A54E'
	                    }
	                },
	                title: {
	                    text: config.tuxml.yunit_m,
	                    style: {
	                        color: '#89A54E'
	                    }
	                }
	            }];
    	
			if(config.tuxml.yunit_m == undefined)
			{
				if(type == "scatter")
				{
					var yobj = getObjById(config.tuxml.weicode,config.tuxml.tuserials.tuserial[1].code);
					if(yobj != null)
					yAxis[0].title.text = yobj.name;
				}
			
			}
			
			var czhou = 0;
			$(config.tuxml.tuserials.tuserial).each(function(index,val)
				{
					if(val.mainh)
						{
						  if(val.mainh == "1")
							  {
							  czhou = 1;
							  return false;
							  }
							 
						  
						}
				}
			);
		if(czhou == 1)
			{
				var yAxis2 =
				{ 
	                title: {
	                    text: config.tuxml.yunit_c,
	                    style: {
	                        color: '#4572A7'
	                    }
	                },
	                labels: {
	                	formatter:function() {
		                  	  return this.value; 
	      					 },
	                    style: {
	                        color: '#4572A7'
	                    },x:-5
	                },
	                opposite: true
	            };
			
	          yAxis.push(yAxis2);
			}
		return yAxis;
	}

	//创建series
	function createSeriesData(seriesVal)
	{
	
			var data = [];
			var value = 0;

	
			$(table[xType]).each(function(key,xval){ 
				var seriesobj = getObjById(config.tuxml.weicode,seriesVal.code);
 				var xvalobj = getObjById(xType,xval.id);
					if(config.tuxml.weicode == "row")
			 		{
			 		    value = getData(seriesobj.index,xvalobj.index);
			 		}else if(config.tuxml.weicode == "col")
			 		{
			 			value = getData(xvalobj.index,seriesobj.index);
			 		}

					if(charttypes[seriesVal.tusort] == "pie")
					{
						data.push([xval.name,value]);
					}
					else
					{
						data.push(value);	
					}

		     });
	
		return data;
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


function createScatterChart()
{


}
function createHighchart()
{
	var chartOption = 
	{
            chart: {
            	//marginRight:30,
            	//marginBottom:100
            	 //margin: [5, 5, 5, 5] //距离上下左右的距离值
            },
            colors:colors,
            legend:{
            	reversed:0,y:10
            },
            title: {
                text: config.tuxml.text
            },
            subtitle: {
                text: ''
            },
            xAxis: createxAxis(),
            yAxis: createyAxis(),
            tooltip: {
                shared: false
            },
            exporting:{  
				filename:'chart',  
				type:"image/png"
			}, 
            plotOptions: {
            	
                line: {
                    dataLabels: {
                        enabled: parseInt(config.tuxml.tuLabSort)
                    },
                    enableMouseTracking: true
                },
                spline: {
                    dataLabels: {
                        enabled: parseInt(config.tuxml.tuLabSort)
                    },
                    enableMouseTracking: true
                },
                column: {
                    dataLabels: {
                        enabled: parseInt(config.tuxml.tuLabSort)
                    },
                    enableMouseTracking: true
                },
                bar: {
                	events:{
                		click : function(e)
                		{
                			
                		}
                	},
                    dataLabels: {
                        enabled: parseInt(config.tuxml.tuLabSort)
                    },
                    enableMouseTracking: true
                },
                scatter:{
                	
               	 dataLabels: {
               		align:"right",
                        enabled: parseInt(config.tuxml.tuLabSort),
                        format: '<b>{series.name}</b>'
                    },
                    showInLegend:true
                
                },
                pie:{  
                	 dataLabels: {
                         enabled: parseInt(config.tuxml.tuLabSort),
                         color: '#000000',
                         connectorColor: '#000000',
                         format: '{point.percentage:.2f} %'
                     },
                	showInLegend:true
                }
            },
            series: series
       };
       
	
        return chartOption;
}
	return this;
}

})(jQuery);