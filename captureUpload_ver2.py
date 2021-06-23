from firebase import firebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage


cred=credentials.Certificate('C:\\Users\\Nice\\AppData\\Local\\Programs\\Python\\Python36\\dht_script\\Json\\beebot-iot-53139bc86105.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'beebot-iot.appspot.com'
})
#db = firestore.client()
bucket = storage.bucket()
blob = bucket.blob('imagePython/frame11.jpg')
outfile='C:\\Users\\Nice\\AppData\\Local\\Programs\\Python\\Python36\\dht_script\\data\\frame11.jpg'
#with open(outfile, 'rb') as my_file:
    #blob.upload_from_file(my_file)
blob.upload_from_filename(
    filename=outfile,
    content_type='image/jpg'
)
firebase_post = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/')
firebase_post.post('/imagePython','https://firebasestorage.googleapis.com/v0'+blob.path+'?alt=media')
print(blob.path)


#print(blob.time_created)
#for f in bucket.list_blobs():
  #print(f.name)
  #print(f.public_url)
  #print(f.download_as_string)
  #print(f.path)
  #rint(f.self_link)
#print(blob.time_created)
#print(blob.updated)
#print(blob.public_url)
