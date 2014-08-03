#!/usr/bin/env python
#-*-coding:utf-8 -*-
from bs4 import BeautifulSoup
import os
class AnalyseBaike:
    def __init__(self,kw):
        self.kw=kw
    def readRaw(self):
        dirname="rawdata\\%s.txt" %self.kw.decode("utf8","ignore").encode("gb18030")
        if os.path.isfile(dirname):
            rawfile=open(dirname,"rb")
            self.html=rawfile.read()
            rawfile.close()
            self.flag=1
        else:
            print "The file not exist"
            self.flag=0
  
    def getTitle(self):
        if self.lemmaTitle:
            return {"lemmatitle":str(self.lemmaTitle)}
        else:
            return 0
    def getBaseInfo(self):
        if self.base:
            return {"baseinfo":str(self.base)}
        else:
            return 0
    def getSummaryContent(self):
        if self.summaryContent:    
            summary=self.summaryContent.find_all("div",class_="para")
            # print summary
            summarycontent={"summarycontent":"".join([str(i) for i in summary])}
            return {"summarycontent":"".join([str(i) for i in summary])}
        else:
            return 0
    def getLemmaContent(self):
        if self.lemmaContent:       
            allIndex=self.lemmaContent.find_all("h2","headline-1")
            lemma=[]
            # print allIndex
            for index in range(len(allIndex)):
                name=allIndex[index].find_all("span")[1]
                currentEle=allIndex[index].find_next_sibling()
                content=""
                while currentEle["class"][0]=="para":
                    # print currentEle
                    content+=str(currentEle)
                    currentEle=currentEle.find_next_sibling()
                    # print currentEle.name
                    if currentEle.name=="script":
                        break
                lemma.append({"paraname":str(name),"lemmacontent":str(content)})
            return lemma
        else:
            return 0
    def getDetail(self):
        self.readRaw()
        if self.flag:
            soup=BeautifulSoup(self.html)
            # print soup
            #主要内容，各段落的信息
            self.lemmaContent=soup.find("div",id="lemmaContent-0")
            # print lemmaContent
            lemma=self.getLemmaContent()
            # print lemma[2]["lemmacontent"],lemma[2]["paraname"]
            #概要信息
            self.summaryContent=soup.find("div",class_="card-summary-content")
            # print summaryContent
            summary=self.getSummaryContent()
            # print summary["summarycontent"]
            #基本信息
            self.base=soup.find("div",class_="baseInfoWrap")
            baseInfo=self.getBaseInfo()
            # print baseInfo["baseinfo"]

            self.lemmaTitle=soup.find("span",class_="lemmaTitleH1")
            title=self.getTitle()
            # print title["lemmatitle"]

            detail={"cityname":self.kw,"detail":[title,summary,baseInfo,lemma]}
            print detail["cityname"]
            return detail
