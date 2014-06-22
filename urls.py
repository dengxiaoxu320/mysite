from django.conf.urls.defaults import patterns, include, url
import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    (r'^city/$','city.views.city'),
    (r'^map/$','city.views.map'),
    (r'^file/$','city.views.file'),
    (r'^css/(?P<path>.*)','django.views.static.serve',{'document_root':"C:\mysite\city\\templates\static\css"}),
    (r'^image/(?P<path>.*)','django.views.static.serve',{'document_root':"C:\mysite\city\\templates\static\image"}),
    (r'^js/(?P<path>.*)','django.views.static.serve',{'document_root':"C:\mysite\city\\templates\static\js"}),
)
