#!/usr/bin/env python
#-*-coding:utf-8 -*-
from analyser import AnalyseBaike
from crawler import CrawlerBaike
import stackless
import MySQLdb
import pymongo


con = pymongo.Connection('localhost', 27017) 
baike=con.baike
baidetail=baike.detail   

def getAllName():
    try:
        conn=MySQLdb.connect(host='localhost',user='root',passwd='city',db='city',port=3306,charset='utf8')
        cur=conn.cursor()
        cur.execute('SELECT cityName FROM city_cityinfo')
        results=cur.fetchall()
        res=[]
        for r in results:
            res.append(r[0])
        # print len(res)
        cur.close()
        conn.close()
        return res
    except MySQLdb.Error,e:
         print "Mysql Error %d: %s" % (e.args[0], e.args[1])

cl=CrawlerBaike()
def getName(flag):
    for name in getAllName():
        sendinfo={"name":name,"flag":flag}
        chan.send(sendinfo)

def getHtml():
    while 1:
        receinfo=chan.receive()
        
        name=receinfo["name"]
        flag=receinfo["flag"]
        if flag:
            # print "crawler"
            cl.getHtml(name.encode("utf8"))
            print "succeed crawl %s" %name.encode("utf8")
        else:
             ab=AnalyseBaike(name.encode("utf8"))
             print name.encode("utf8")
             detail=ab.getDetail()
             baidetail.insert(detail)
             # print detail["cityname"]
            # print "analyser"
            # print "succeed analyse %s" %name.encode("utf8")

chan=stackless.channel()
[stackless.tasklet(getHtml)() for i in range(10)]
#1,crawler;0,analyser
stackless.tasklet(getName)(0)
stackless.run()


 # cl=CrawlerBaike()
# cl.getHtml("广东省佛山市三水区乐平镇大旗头村")
# ab=AnalyseBaike("乌镇")
# ab.readRaw()
# ab.getDetail()
