from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse
from django.contrib.staticfiles import finders

import json


def SelectRoute(request):
    origin = request.GET['origin']
    destination = request.GET['destination']
    print("HERE", origin, destination)
    return HttpResponse("Your journey is important to us, please wait while we finish the app and we'll figure it out")

def Stops(request):
   # stopsPath = finders.find("JSON/stops.json")
   # stopsString = json.loads(stopsPath)
   # print(stopsString)
   json_data = open(finders.find('JSON/stops_and_their_buses.json'))
   data1 = json.load(json_data)  # deserialises it
   data2 = json.dumps(data1)  # json formatted string
   json_data.close()
   return JsonResponse(data2, safe=False)


def HelloWorldView(request):
    response = HttpResponse("Hello World!")
    return response

def MainPageView(request):
    return render(request, "index.html")

def MapView(request):
    return render(request, "map.html")