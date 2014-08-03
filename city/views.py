# Create your views here.
#-*-coding:utf-8 -*-
from django.shortcuts import render_to_response
from django.http import  HttpResponse
from django.utils import simplejson
from django.core import  serializers
from mysite.city.models import CityInfo
from mysite.city.models import GdpPoulation
from mysite.city.models import CityName
from django.db.models import Count
import json
from baike.baike import  Baike

def city(request):
         return render_to_response("index.html",{})
def file(request):
         return render_to_response("file.html",{})
def map(request):
    reponse=HttpResponse()
    if  request.is_ajax() and request.method=="POST":
        # print request.POST.get("name","")
        chartType=request.POST.get("chartType","")
        #通过关键字搜索，返回名镇名村
        if int(chartType)==0:
            kw=request.POST.get("name","")
            print kw
            ci=serializers.serialize("json",CityInfo.objects.all().filter(cityName__contains=kw).order_by("cityName"))
            # ci=serializers.serialize("json",CityInfo.objects.all())
            print ci
            reponse.write(ci)
        #各省名镇名村总数
        elif int(chartType)==1:
            # kw=request.POST.get("name","")
            num=[]
            for item in CityInfo.objects.values('cityProcice').annotate(numCity=Count('cityProcice')):
                num.append(item)
            # num=sorted(user.items(),key=lambda e:e[1],reverse=True)
            print num,json.dumps(num)
            reponse.write(json.dumps(num))
        # GDP、人口总数、人均GDP，各省名镇名村总数
        elif int(chartType)==2:
            sql='SELECT ip.id,ip.cityProcice,ip.totalGdp,ip.totalPopu,ip.perGdp,COUNT(ip.cityProcice) as numCity FROM (SELECT ci.id,ci.cityName, ci.cityProcice, gp.totalGdp, gp.totalPopu,gp.perGdp FROM city_cityinfo ci LEFT JOIN city_gdppoulation gp ON ci.cityProcice = gp.cityProcice) ip GROUP BY ip.cityProcice ORDER BY COUNT(ip.cityProcice) DESC'
            gp=GdpPoulation.objects.raw(sql)
            num=[]
            for item in gp:
                num.append({"numCity":item.numCity,"cityProcice":item.cityProcice,"totalGdp":item.totalGdp,"totalPopu":item.totalPopu,"perGdp":item.perGdp})
            print num
            # num=sorted(num.items(),key=lambda e:e[1],reverse=True)
            reponse.write(json.dumps(num))
        elif int(chartType)==3:
            sql='SELECT id,theBatch,countryFlag,COUNT(theBatch) AS totalNum FROM city_cityinfo  GROUP BY theBatch,countryFlag'
            ci=CityInfo.objects.raw(sql)
            num=[]
            for item in ci:
                num.append(item.totalNum)
            reponse.write(json.dumps({"villages":[num[i] for i in range(len(num)) if i%2==0],"towns":[num[i] for i in range(len(num)) if i%2==1]}))
        elif int(chartType)==4:
            sql='SELECT ci.id,ci.cityProcice,COUNT(ci.cityName) AS numCity,COUNT(ci.cityName) / cn.cityArea AS perDensity FROM city_cityinfo ci LEFT JOIN city_cityname cn ON ci.cityProcice = cn.chiName GROUP BY ci.cityProcice ORDER BY numCity desc'
            ni=CityName.objects.raw(sql)
            num=[]
            for item in ni:
                num.append({"cityProcice":item.cityProcice,"numCity":item.numCity,"perDensity":"%.2f" %item.perDensity})
            print num
            reponse.write(json.dumps(num))
        elif int(chartType)==5:
            sql='SELECT ci.id, COUNT(ci.cityName) AS subNum,ci.countryFlag,cn.cityRegion FROM city_cityinfo ci LEFT JOIN city_cityname cn ON ci.cityProcice=cn.chiName GROUP BY ci.countryFlag,cn.cityRegion'
            ni=CityName.objects.raw(sql)
            num=[]
            for item in ni:
                num.append(item.subNum)
            print num
            reponse.write(json.dumps({"villages":[num[i] for i in range(7)],"towns":[num[i] for i in range(7,14)]}))
        elif int(chartType)==6:
            sql='SELECT id,cityProcice FROM  city_cityinfo GROUP BY cityProcice'
            ni=CityName.objects.raw(sql)
            num=[]
            for item in ni:
                num.append(item.cityProcice)
            print json.dumps(num)
            reponse.write(json.dumps(num))
        elif int(chartType)==7:
            sql='SELECT id,cityname FROM city_cityinfo WHERE countryFlag=0 ORDER BY cityname'
            ni=CityName.objects.raw(sql)
            num=[]
            for item in ni:
                num.append(item.cityname)
            print json.dumps(num)
            reponse.write(json.dumps(num))
    return HttpResponse(reponse)

def detail(request,pk):
    response=HttpResponse()
    cityname=CityInfo.objects.filter(pk=pk)
    print cityname[0].cityName
    bk=Baike()
    cityDetail=bk.getCityDetail(cityname[0].cityName)
    return render_to_response("detail.html",{"cityDetail":cityDetail})