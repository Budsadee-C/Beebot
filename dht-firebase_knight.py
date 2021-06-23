#Armote -25610105
#import RPi.GPIO as GPIO
from time import sleep
import datetime
from firebase import firebase
from random import randint
#import Adafruit_DHT

import urllib2, urllib, httplib
import json
import os
from functools import partial

loop1 = 1.0

"""GPIO.setmode(GPIO.BCM)
GPIO.cleanup()
GPIO.setwarnings(False)
"""
# Sensor should be set to Adafruit_DHT.DHT11,
# Adafruit_DHT.DHT22, or Adafruit_DHT.AM2302.
#sensor = Adafruit_DHT.DHT11

# Example using a Beaglebone Black with DHT sensor
# connected to pin P8_11.
#pin = 4

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
#humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

#Knight created v this database
#firebase = firebase.FirebaseApplication('https://raspberrypi-3d41f.firebaseio.com/', None)

#Knight created this database
firebase = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/', None)

#firebase.put("/dht", "/temp", "0.00")
#firebase.put("/dht", "/humidity", "0.00")

def update_firebase():
    global loop1
    #humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    #if humidity is not None and temperature is not None:
    #sleep(5)
    #	str_temp = ' {0:0.2f} *C '.format(temperature)
    #	str_hum  = ' {0:0.2f} %'.format(humidity)
    #	print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity))

            #else:
            #print('Failed to get reading. Try again!')
            #sleep(10)
    d = datetime.date.today()
    #data = {"temp": temperature, "humidity": humidity}
    data = {"B_blank": randint(0.1, 14.0),
            "B_sample": randint(0.1, 14.0),
            "G_blank": randint(0.1, 14.0),
            "G_sample": randint(0.1, 14.0) ,
            "R_blank":randint(0.1, 14.0),
            "R_sample": randint(0.1, 14.0),
            "Measurement": randint(6.5, 14.0),
            "SerialNumber": "CKB191019",
            "Version": "v1",
            "kind": "PH",
            "timestamp": d.month+"-"+d.year+" "+d.hour+":"+d.minute+":"+d.second

    }
    #firebase.post('/logDHT', data)
    firebase.post('/Spectrokit', data)
    loop1 = loop1 + 1
    if loop1>=101 :
        quit()


while True:
		update_firebase()

        #sleepTime = int(sleepTime)
		sleep(5)
