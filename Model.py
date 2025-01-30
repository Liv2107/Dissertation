import pandas as pd
import numpy as np
import cv2

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

croppedImage = image[1412:1612, 1916:2116]   
#cv2.imshow('original', image) 
#cv2.imshow('cropped', croppedImage) 
#cv2.waitKey(0) 
#cv2.destroyAllWindows()


# downscale the image for easier processing.

target_height = 120
scale = height/target_height

downscaledImage = cv2.resize(croppedImage, (int(width/scale), int(height/scale)), interpolation = cv2.INTER_AREA)
cv2.imwrite("Images/cropped_downscaled_image.jpg", downscaledImage, (cv2.IMWRITE_JPEG_QUALITY, 95))
#cv2.imshow('cropped', croppedImage) 
#cv2.imshow('downscaled', downscaledImage) 
#cv2.waitKey(0) 
#cv2.destroyAllWindows()


# convert image to a colour space like Lab.

LabValues = cv2.cvtColor(downscaledImage, cv2.COLOR_BGR2Lab)
RGBValues = cv2.cvtColor(downscaledImage, cv2.COLOR_BGR2RGB)
#print(LabValues)
#print(RGBValues)


# Average colour of all pixles.

avgLab = np.mean(LabValues.reshape(-1, 3), axis=0)
avgRGB = np.mean(RGBValues.reshape(-1, 3), axis=0)

# Individual values.
lightness = avgLab[0]
R, G, B = avgRGB

# get values - hex (rgb) and lightness (Lab) values

try:
    R, G, B = int(R), int(G), int(B)
except:
    print("An integer error occured.")

hex_colour = "#{:02x}{:02x}{:02x}".format(R, G, B)


# Colour similarity - eg - Delta E or euclidean distance with rgb but delta is a lot more accuracte. 

# search the database for the closest match

closestMatch = 0 # Delta E (using rgbValues and lightness)

# this information then will need to be returned from 

