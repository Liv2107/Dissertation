import pandas as pd
import numpy as np
import cv2

from colormath.color_diff import delta_e_cie2000

shades = pd.read_csv('datasets/FoundationShades/allCategories.csv')

image = "Images/example_image.jpeg"  # eventually will be a select method to take from the imagecapturehub database.
image = cv2.imread(image)
height, width, channels = image.shape

print(type(image))
print("Height: ", height, ", Width: ", width, ", Channels: ", channels)
#Display the image
#cv2.imshow('image', image)
#cv2.waitKey(0)
#cv2.destroyAllWindows()



# use open cv to crop the image to a small patch of skin.

def crop_image(image):
    return image[1412:1612, 1916:2116]  
 
croppedImage = crop_image(image)



# downscale the image for easier processing.

def downscale_image(image):

    target_height = 120
    scale = height/target_height

    downscaledImage = cv2.resize(croppedImage, (int(width/scale), int(height/scale)), interpolation = cv2.INTER_AREA)
    cv2.imwrite("Images/cropped_downscaled_image.jpg", downscaledImage, (cv2.IMWRITE_JPEG_QUALITY, 95))
    return downscaledImage

downscaledImage = downscale_image(croppedImage)



# convert image to a colour space like Lab.

def find_RGB_values(image):
    return cv2.cvtColor(downscaledImage, cv2.COLOR_BGR2RGB)

RGBValues = find_RGB_values(downscaledImage)

def find_Lab_values(image):
    return cv2.cvtColor(downscaledImage, cv2.COLOR_BGR2Lab)

LabValues = find_Lab_values(downscaledImage)

#print(LabValues)
#print(RGBValues)



# Average colour of all pixles.

def average_Lab_values(LabValues):
    return np.mean(LabValues.reshape(-1, 3), axis=0)

avgLab = average_Lab_values(LabValues)

def average_RGB_values(RGBValues):
    return np.mean(RGBValues.reshape(-1, 3), axis=0)

avgRGB = average_RGB_values(RGBValues)



# get hex values.

def get_hex(R,G,B):
    return "#{:02x}{:02x}{:02x}".format(R, G, B)



# Individual values.

R, G, B = avgRGB

try:
    R, G, B = int(R), int(G), int(B)
    hex_colour = get_hex(R,G,B)
except:
    print("An integer error occured.")



# Lightness values from Lab.

def find_lightness(avgLab):
    return avgLab[0]

lightness = find_lightness(avgLab)



# Colour similarity - eg - Delta E or euclidean distance with rgb but delta is a lot more accuracte. 
# pip install colormath pandas



# search the database for the closest match

closestMatch = 0 # Delta E (using rgbValues and lightness)

# this information then will need to be returned from 

