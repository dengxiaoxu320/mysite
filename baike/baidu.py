#!/usr/bin/env python
 # -*- coding:utf8 -*- 
import mechanize
from bs4 import BeautifulSoup
import os

class CrawlerBike:
    #self.browser
    def __init__(self,url):
        self.url=url
        self.br = mechanize.Browser()

        # options
        self.br.set_handle_equiv(True)
        self.br.set_handle_gzip(True)
        self.br.set_handle_redirect(True)
        self.br.set_handle_referer(True)
        self.br.set_handle_robots(False)

        #Follows refresh 0 but not hangs on refresh > 0
        self.br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time=1)

        #debugging?
        # self.br.set_debug_http(True)
        # self.br.set_debug_redirects(True)
        # self.br.set_debug_responses(True)
        #User-Agent (this is cheating, ok?)
        self.br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]

    def saveRaw(self,kw,raw):
        ra=open("rawdata\\%s.txt"  %kw.decode("utf8","ignore").encode("gb2312"),"w")
        ra.write(raw)

    def getHtml(self,kw):

        response = self.br.open(self.url)
        html = response.read()
        # print html
        self.br.select_form(nr=0)
        self.br.form['word']=kw
        self.br.submit()

        html=self.br.response().read()
        self.saveRaw(kw,html)

    def readRaw(self,dirname):
        rawfile=open(dirname,"rb")
        html=rawfile.read()
        rawfile.close()
        return html
    def getTitle(self):
        pass
    def getBaseInfo(self):
        pass
    def getLemmaContent(self,lemmaContent):
        allIndex=lemmaContent.find_all("h2","headline-1")
        lemma={}
        for index in range(len(allIndex)):
            lemma[index]=[]
            # print allIndex[index]
            currentEle=allIndex[index].find_next_sibling()
            while currentEle["class"][0] != "anchor-list":
                # print currentEle
                lemma[index].append(currentEle)
                currentEle=currentEle.find_next_sibling()
            else:
                break
        # print [i for i in lemma[0]]
        print [ i.text for i in lemma[0][0].find_all("a")]
    def getContent(self,kw):
        dirname="rawdata\\%s.txt" %kw.decode("utf8","ignore").encode("gb2312")
        # print dirname
        if os.path.isfile(dirname):
            html=self.readRaw(dirname)
        else:
            self.getHtml(kw)
            html=self.readRaw(dirname)
        soup = BeautifulSoup(html,)
        # print soup
        lemmaContent=soup.find("div","lemma-main-content")
        self.getLemmaContent(lemmaContent)
        # print lemmaContent

url="http://baike.baidu.com/"
a=CrawlerBike(url)
# a.getHtml("乌镇")
a.getContent("乌镇")

