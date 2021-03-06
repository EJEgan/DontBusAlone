import requests
import json
from pymysql import connect
import pytz
import datetime
class BikeStationsSpider:
    def __init__(self):
        self.url = "http://api.openweathermap.org/data/2.5/weather?q=dublin&appid=86e6d9e6dddfc8dccd6899f2454e98c2"
        self.headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"}
    def parse_url(self):
        url = self.url
        response = requests.get(url,headers=self.headers)
        content = json.loads(response.text)
        self.save_data(content)
    def save_data(self,content):
        tz = pytz.timezone('Eire')
        dtime = datetime.datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S")
        dtime = "\"" + dtime + "\""	
        conn = connect(host="localhost", port=3306, user="root", password="4TheWin!", database="project",
                            charset="utf8")
        cs = conn.cursor()
        cs.execute("TRUNCATE realtime_weather_data")
        value = "insert into realtime_weather_data values("
        value += str(dtime)
        value += ","
        value += str(content["main"]["temp"])
        value += ","
        value += str(content["main"]["humidity"])
        value += ","
        value += str(content["wind"]["speed"])
        value += ","
        value += "\"" + str(content["weather"][0]["description"]) + "\""
        value += ");"
        print(value)
        cs.execute(value)
        conn.commit()
        cs.close()
        conn.close()
    def run(self):
        self.parse_url()
if __name__ == "__main__":
    Bike = BikeStationsSpider()
    Bike.run()
