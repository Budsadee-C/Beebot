from time import sleep
import datetime
from firebase import firebase
from random import randint
from random import randrange
import random
import sys



loop1 = 1.0

firebase = firebase.FirebaseApplication('https://beebot-iot.firebaseio.com/', None)

#firebase.put("/dht", "/temp", "0.00")
#firebase.put("/dht", "/humidity", "0.00")

def update_firebase():
    global loop1
    kind_list = ['Ammonium', 'PH', 'Chlorine', 'Nitrite', 'Phosphate']
    serial_list = ['CKB191003']
    #serial_list = ['CKB191001','CKB191002','CKB191006','CKB191007','CKB191009','CKB191017','CKB191018','CKB191019',
    #'CKB191020','CKB191021']
    #serial_list = ['CKB191001','CKB191002','CKB191003','CKB191004','CKB191005','CKB191006','SAM191001','SAM191002',
    #'SAM191003','SAM191004','SAM191005','SAM191006','SAM191007','SAM191008','CHK191001','CHK191002','CHK191003','CHK191004']
    random_index = randrange(len(kind_list))
    item = kind_list[random_index]
    measure = randint(0, 14)
    random_index = randrange(len(serial_list))
    serial_item = serial_list[random_index]
    now = datetime.datetime.now()
    data = {"B_blank": randint(0, 14),
            "B_sample": randint(0, 14),
            "G_blank": randint(0, 14),
            "G_sample": randint(0, 14),
            "R_blank":randint(0, 14),
            "R_sample": randint(0, 14),
            "Measurement": measure,
            "SerialNumber": serial_item,
            "Version": "v1",
            "kind": item,
            "timestamp": str(now.month)+"-"+str(now.year)+"-"+str(now.day)+" "+
            str(now.hour)+":"+str(now.minute)+":"+str(now.second)
    }
    #firebase.post('/logDHT', data)
    firebase.post('/Spectrokit', data)
    data = {
        "SerialNumber": serial_item,
        "Type": "Spectrokit",
        "kind": item,
        "timestamp": str(now.month)+"-"+str(now.year)+"-"+str(now.day)+" "+
        str(now.hour)+":"+str(now.minute)+":"+str(now.second),
        "value": measure
    }
    firebase.post('/Measurement', data)
    loop1 = loop1 + 1
    if loop1>=3 :
        quit()
update_firebase()
#while True:
    #if 0xFF == ord('q'):
    #    sys.exit()
    #update_firebase()
    #sleep(5)
