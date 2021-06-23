import cv2,time
import numpy as np
import os
video = cv2.VideoCapture(0)

try:
    if not os.path.exists('data'):
        os.makedirs('data')
except OSError:
    print('Error: Createing directory of data')

currentFrame =0
while True:
    ret,frame = video.read()
    name = './data/frame' + str(currentFrame)+'.jpg'
    print('Creating...'+name)
    cv2.imwrite(name,frame)
    cv2.imshow("Capturing..",frame)
    currentFrame +=1
    key = cv2.waitKey(1)
    if key == ord('Q'):
        break
video.release()
cv2.destroyAllWindows()
