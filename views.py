__author__ = 'SQQ'
from django.http import HttpResponse
import datetime

def hello(request):
    now = datetime.datetime.now()
    html = "<html><body><h3>Hello World!</h3>It is now %s </body></html>" % now
    return HttpResponse(html).
