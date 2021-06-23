#import the GPIO and time package
import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BOARD)
GPIO.setup(8, GPIO.OUT)
# loop through 50 times, on/off for 1 second
for i in range(50):
    GPIO.output(8,True)
    time.sleep(1)
    GPIO.output(8,False)
    time.sleep(1)
GPIO.cleanup()