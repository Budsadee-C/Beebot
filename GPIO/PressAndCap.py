import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
import time
import cv2
import numpy as np
from firebase import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred=credentials.Certificate('beebot-iot-53139bc86105.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'beebot-iot.appspot.com'
})

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
bucket = storage.bucket()
framecount = 0
currentFrame =0

while True: # Run forever
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 200)
    if GPIO.input(10) == GPIO.HIGH: #when press button
        print("Begin")
       # cap = cv2.VideoCapture(0)
        framerate = cap.get(cv2.CAP_PROP_FPS)
        status = True
        while(status):
            success, image = cap.read()
            framecount += 1
            if framecount == (framerate * 10):
                framecount = 0
                name = 'frame' + str(currentFrame)+'.jpg'
                cv2.imwrite(name,image)
                cv2.imshow('image',image)
                blob = bucket.blob('imagePython/frame'+ str(currentFrame)+'.jpg')
                outfile='frame'+ str(currentFrame)+'.jpg'
                blob.upload_from_filename(
                    filename=outfile,
                    content_type='image/jpg'
                )
                firebase_post = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/')
                firebase_post.post('/imagePython','https://firebasestorage.googleapis.com/v0'+blob.path+'?alt=media')
                currentFrame +=1
                status = False
            #if cv2.waitKey(1) & 0xFF == ord('q'):
                  #break
        #cap.release()
        #cv2.destroyAllWindows()
    elif(GPIO.input(10)== GPIO.LOW):
        print("Close")
    cap.release()
    cv2.destroyAllWindows()
