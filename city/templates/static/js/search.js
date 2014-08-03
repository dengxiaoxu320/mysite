/**
 * Created with PyCharm.
 * User: SQQ
 * Date: 14-4-27
 * Time: 下午5:09
 * To change this template use File | Settings | File Templates.
 */


var dsearch={
    mouse:function(){
        var $suggest= $("#suggest")
        $("#kw").bind("input propertychange",function(){
            console.debug($(this).val());
            dsearch.search();
            $suggest.css("display","block");
         })
        $suggest.hover(function(){
            $(this).css("display","block");
        },function(){
            $(this).css("display","none");
        })
    },

    search:function(){
        $.post("/map/",{name:$("#kw").val(),chartType:"0"},function(s){
                s=eval('('+s+')');
                console.debug(s);
                var names=[];
                $("#suggest").empty();
                for(i=0;i< s.length;i++){
                    names.push(s[i].fields.cityName);
                    dsearch.refresh(s[i].fields.cityName);
                }
                dsearch.color();
                dsearch.getvalue();
                console.debug(names);

        })
    },

    refresh:function(subitem){
        if (subitem.length>12 )
        {
                        var sliceName=subitem.slice(0,12)+"..."
                        $("#suggest").append("<span class='result' title="+subitem+">"+sliceName+"</span><br>")
        }
        else{
            $("#suggest").append("<span class='result' title="+subitem+">"+subitem+"</span><br>")
        }

    },

    color:function(){
        $("#suggest .result").each(function(){
            console.debug(this);
            $(this).hover(function(){
                $(this).addClass("onmouseover");
//                $(this).children().css("display","block");
            },function(){
                $(this).removeClass("onmouseover");
                $(this).addClass("onmouseout");
//                 $(this).children().css("display","none");
            }
        )
        })
    },

    getvalue:function(){
        $("#suggest .result").each(function(){
            $(this).click(function(){
                console.debug($(this).attr("title"));
                $("#kw").val($(this).attr("title"));
            })
        })
    }



}


