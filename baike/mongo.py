#-*-coding:utf-8 -*-
import re

#[\u4e00-\u9fa5] 中文unicode编码
#[u"省",u"市",u"县",u"镇",u"村"];[u'\u7701', u'\u5e02', u'\u53bf', u'\u9547', u'\u6751']

a=re.split(u"[\u7701,\u5e02,\u53bf,\u9547,\u6751]",u"山西省临县碛口镇西湾村")

print a[0].encode("utf8"),a[1].encode("utf8"),a[2].encode("utf8"),a[3].encode("utf8") 