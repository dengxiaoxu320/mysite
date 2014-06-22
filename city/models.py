from django.db import models
class CityInfo(models.Model):
    cityName=models.CharField(max_length=20)
    cityProcice=models.CharField(max_length=30)
    def __unicode__(self):
        return "cityName:%s,cityProcice:%s" %(self.cityName,self.cityProcice)
class GdpPoulation(models.Model):
    cityProcice=models.CharField(max_length=30)
    totalGdp=models.CharField(max_length=30)
    totalPopu=models.CharField(max_length=30)
    perGdp=models.CharField(max_length=30)
    def __unicode__(self):
        return "cityProcice:%s,totalGdp:%s,totalPopu:%s,perGdp:%s" %(self.cityProcice,self.totalGdp,self.totalPopu,self.perGdp)
class CityName(models.Model):
    cityCode=models.CharField(max_length=30)
    chiName=models.CharField(max_length=30)
    engName=models.CharField(max_length=30)
    cityArea=models.FloatField(max_length=30)
    def __unicode__(self):
        return "cityCode:%s,chiName:%s,engName:%s,cityArea:%.2f" %(self.cityCode,self.chiName,self.engName,self.cityArea)