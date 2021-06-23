import cv2
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

import firebase
#from google.cloud import storage
#from google.cloud.storage import client

#from oauth2client.client import GoogleCredentials
#GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json'
#credentials = GoogleCredentials.get_application_default()

firebase = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/')
client = storage.Client()
bucket = client.get_bucket('beebot-iot.appspot.com')

images = bucket.get_blob('frame6.jpg')
images.upload_from_filename(filename='/data/frame5.jpg')

imageBlob = bucket.get_blob('Image/frame5.jpg')
imageBlob.download_as_string()
