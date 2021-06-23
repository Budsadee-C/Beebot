import cv2, time
#1). create an obj.
video = cv2.VideoCapture(0) # 0 for external camera
#8). create a variable
a=0

while True:
    a = a+1
    check, frame = video.read() #3). Create frame obj
    print(check)
    print(frame) #Representing image as matrix
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) #6). convert to COLOR_BGR2GRAY
    cv2.imshow("Capturing",gray) #4). show the frame

    #cv2.waitKey(0) #5). For press any key to out(milisecond)
    #7). For playing
    key=cv2.waitKey(1)
    if key == ord('q'):
        break
print(a)
video.release() #2). Dont' forget!! shuntdown the camera
cv2.destroyAllWindows
