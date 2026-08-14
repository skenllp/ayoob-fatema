import cv2
import os

video_path = 'assets/opening-video.mp4'
output_path = 'assets/opening-frame.jpg'

if os.path.exists(video_path):
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(output_path, frame)
        print(f'First frame extracted and saved to {output_path}')
    else:
        print('Failed to read video frame')
    cap.release()
else:
    print(f'Video file not found: {video_path}')
