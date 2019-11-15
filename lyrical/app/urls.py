from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('callback', views.callback),
    #     path('home', views.home),
    #     path('logout', views.logout),
    #     path('report', views.report),
]
