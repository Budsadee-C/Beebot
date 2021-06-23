
import cv2
import numpy as np
from firebase import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred=credentials.Certificate('C:\\Users\\Nice\\AppData\\Local\\Programs\\Python\\Python36\\dht_script\\Json\\beebot-iot-53139bc86105.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'beebot-iot.appspot.com'
})
bucket = storage.bucket()
cap = cv2.VideoCapture(0)
framerate = cap.get(cv2.CAP_PROP_FPS)
framecount = 0
currentFrame =0


while(True):
    # Capture frame-by-frame
    success, image = cap.read()
    #framecount += 1

    # Check if this is the frame closest to 10 seconds
    #if framecount == (framerate * 10):
     #  framecount = 0
     name = './data/frame' + str(currentFrame)+'.jpg'
     cv2.imwrite(name,image)
     cv2.imshow('image',image)
     blob = bucket.blob('imagePython/frame'+ str(currentFrame)+'.jpg')
     outfile='C:\\Users\\Nice\\AppData\\Local\\Programs\\Python\\Python36\\dht_script\\data\\frame'+ str(currentFrame)+'.jpg'
     blob.upload_from_filename(
           filename=outfile,
           content_type='image/jpg'
       )
     firebase_post = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/')
     firebase_post.post('/imagePython','https://firebasestorage.googleapis.com/v0'+blob.path+'?alt=media')
     currentFrame +=1

    # Check end of video
    if cv2.waitKey(1) & 0xFF == ord('q'):
          break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
