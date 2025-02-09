from fastapi import FastAPI
from pydantic import BaseModel

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



def imagePreProcessing(image):

    # cropping and downscaling

    croppedImage = image[1412:1612, 1916:2116] 

    target_height = 120
    scale = height/target_height

    downscaledImage = cv2.resize(croppedImage, (int(width/scale), int(height/scale)), interpolation = cv2.INTER_AREA)
    cv2.imwrite("Images/cropped_downscaled_image.jpg", downscaledImage, (cv2.IMWRITE_JPEG_QUALITY, 95))

    return downscaledImage

finalImage = imagePreProcessing(image)



# convert image to a colour space like Lab.

def find_RGB_values(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
def find_Lab_values(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2Lab)

RGBValues = find_RGB_values(finalImage)
LabValues = find_Lab_values(finalImage)


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

from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color


# convert hex values to lab to find lightness for delta e calculation

def hex2lab(hex):
    RGBValues = sRGBColor.new_from_rgb_hex(hex)
    return convert_color(RGBValues, LabColor)

    
shades["lab"] = shades["hex"].apply(hex2lab) # new column of Lab values.

print(shades.columns)
# Calculating delta_e using lab values comparing the users image to the shades avaliable.

h, w, c = LabValues.shape

Lab_Color = LabColor(*LabValues[h//2, w//2])  # Select centre pixel (L, a, b)
print("Center Lab Value:", LabValues[h//2, w//2])

print("Lab_Color ", type(Lab_Color))
print("shades ", type(shades["lab"]))
print(shades["lab"].apply(type))  # Check types of all entries



def delta_e(lab_value):

    if not isinstance(lab_value, LabColor):
        print(f"Unexpected type: {type(lab_value)}")
        return np.nan  # Return NaN if the value is not correct

    return delta_e_cie2000(Lab_Color, lab_value)

shades["delta_e"] = shades["lab"].apply(delta_e)
shades = shades.sort_values(by="delta_e", ascending=True)

top_20 = shades.head(20)
print("Top ten closest matches: ", top_20)

print("hex, lightness of image: ", get_hex(R, G, B), find_lightness(avgLab))
name_brand_hex_lightness = top_20[['name', 'brand', 'hex', 'lightness']]
print(name_brand_hex_lightness)
