from django.urls import path # new
from .views import HelloWorldView, MainPageView, MapView
urlpatterns = [
    path('helloworld', HelloWorldView, name='HelloWorld'),
    path('', MainPageView, name='MainPageView'),
    path('map', MapView, name='MapView'),
]