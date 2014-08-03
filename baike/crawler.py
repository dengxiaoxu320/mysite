#!/usr/bin/env python
#-*-coding:utf-8 -*-
import mechanize
from bs4 import BeautifulSoup

class CrawlerBaike:
    def __init__(self):
        self.url="http://baike.baidu.com/"
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
        self.br.open(self.url)
    def saveRaw(self,kw,raw):
        ra=open("rawdata\\%s.html"  %kw.decode("utf8","ignore").encode("gb18030"),"w")
        ra.write(raw)

    def getHtml(self,kw):
        self.br.select_form(nr=0)
        self.br.form['word']=kw
        self.br.submit(nr=0)

        html=self.br.response().read()
        if  u"进入词条" in BeautifulSoup(html).title.text:
            modlist=BeautifulSoup(html).find("div",class_="mod-list")
            url=modlist.a["href"]
            # print url
            self.br.open(url)
            html=self.br.response().read()
            # print html
        self.saveRaw(kw,html)

# cl=CrawlerBaike()
# cl.getHtml("山西省临县碛口镇西湾村")