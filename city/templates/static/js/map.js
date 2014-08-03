
var markers=[];
var pinkIcon= new BMap.Icon('http://127.0.0.1:8000/image/pinkflag.png', new BMap.Size(30, 30));
var blueIcon=new BMap.Icon('http://127.0.0.1:8000/image/blueflag.png', new BMap.Size(30, 30));
var greenIcon=new BMap.Icon('http://127.0.0.1:8000/image/blueflag.png', new BMap.Size(30, 30));

var dMap={

    refresh: function (subitem){
        $("#left-restul").append("<dl><dt><a id='result' style='color: blue'>"+subitem+"</a></dt></dl>");
    },

    cache: function(names,num_pages,pages){
        var pages=[];
        for (j=1;j<=num_pages;j++){
            var cache=[];
            for(i=(j-1)*8;i<j*8;i++){
                if(i==names.length-1){
                    cache.push(names[i]);
                    break;
                }
                 cache.push(names[i]);
            }
            pages.push(cache);
        }
        return pages;
    },

    marker: function(cityname,icon){
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(cityname, function(point){
          if (point) {
//            console.debug(point);
//            mark=new BMap.Marker(point);

            mark=new BMap.Marker(point,{icon:icon});
            map.addOverlay(mark);

//            var infoWindow = new BMap.InfoWindow("<div id=\"container\" style=\"min-width: 400px; height: 400px; margin: 0 auto\"></div>");
            var infoWindow = new BMap.InfoWindow("<div>"+cityname+"</div>");
            mark.addEventListener("click",function(){
                this.openInfoWindow(infoWindow);
//                dChart.charts();
            });
            markers.push(mark);
          }

        }, "");
    },

    //实现翻页功能
    page: function(s){
        var current_page=1
        var page_size=8;
        console.debug(s.length);
        var num_pages=Math.ceil(s.length/page_size)
        pages=dMap.cache(s,num_pages);
//        console.debug(pages);
        if (current_page==1){
            for(i=0;i<pages[current_page-1].length;i++){
//                console.debug(pages[0][i]);
                 dMap.refresh(pages[0][i]);
            }
            $("#num").remove();
            $("#next").after("<span id=\"num\">"+current_page+"/"+ num_pages+"</span>")
            dMap.color();
            $("#page").show();
            $("#prev").hide();
        }

        $("#next").bind("click",function(){
            document.getElementById("left-restul").innerText="";
            current_page++;
//            alert(current_page);
            for(i=0;i<pages[current_page-1].length;i++){
                 dMap.refresh(pages[current_page-1][i]);
            }
            $("#num").remove();
            $("#next").after("<span id=\"num\">"+current_page+"/"+ num_pages+"</span>")
            dMap.color();
            $("#prev").show();
            if (current_page>=num_pages){
                $("#next").hide();
            }
        });


        $("#prev").click(function(){
            current_page--;
//            alert(current_page);
            document.getElementById("left-restul").innerText="";
            for(i=0;i<pages[current_page-1].length;i++){
                 dMap.refresh(pages[current_page-1][i]);
            }
            $("#num").remove();
            $("#next").after("<span id=\"num\">"+current_page+"/"+ num_pages+"</span>")
            $("#next").show();
            if(current_page==1){
                $("#prev").hide();

            }
            dMap.color();
        });

    },

    color: function(){
        $("dt>a").bind("mouseover",function(){
            $(this).css("color","red");
            $(this).each(function(i,e){
               console.debug($(e).text());
               var myGeo = new BMap.Geocoder();
               myGeo.getPoint($(e).text(), function(point){
                   map.centerAndZoom(point,10);
                   var infoWindow = new BMap.InfoWindow("<div>"+$(e).text()+"</div>");
                   map.openInfoWindow(infoWindow,point)
               })
           })
        });
        $("dt").bind("mouseout",function(){
            $("a").each(function(){
                $(this).css("color","blue");
            })
        });

    },
    getcity:function(){
        $.post("/map/",{name:$("#kw").val(),chartType:"0"},function(s){
                s=eval('('+s+')');
                console.debug(s);
                document.getElementById("left-restul").innerText="";
                if (s.length==0){
                    document.getElementById("left-restul").innerText="Sorry";
                }
                var names=[];
                for(i=0;i< s.length;i++){
                    var cityName=s[i].fields.cityName
                    names.push(cityName);
                    map.clearOverlays();
                    dMap.marker(cityName,pinkIcon);
                    dMap.color();
                }
                dMap.page(names);
                // dMap.getLngLat(names)
//                console.debug(names);
        })
    },
    // 获取经纬度
    getLngLat:function(e){
        console.debug(e[67])
        var myGeo = new BMap.Geocoder();
        for(var i=0;i< e.length;i++){
            (function (i,e){
                myGeo.getPoint(e, function(point){
                    console.log(i+":"+e+","+point.lng+","+point.lat)
                })
            })(i,e[i])
        }

    }
}

var dInfo={
    getData:function(){

    }
}

