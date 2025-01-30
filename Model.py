import pandas as pd
import numpy as np
import cv2

shades = pd.read_csv('datasets/FoundationShades/allCategories.csv')

# global photo

# photo = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV)

image = "<filelocation>" # eventually will be a select method to take from the imagecapturehub database.

# use open cv to crop the image to a small patch of skin.

# downscale the image for easier processing.

# convert image to a colour space like Lab.

RGBImage = 0
LabImage = 0

# use average colour of all the pixles in the photo.

# get values - hex (rgb) and lightness (Lab) values

rgbValues = RGBImage
lightness = LabImage

# Colour similarity - eg - Delta E or euclidean distance with rgb but delta is a lot more accuracte. 

# search the database for the closest match

closestMatch = 0 # Delta E (using rgbValues and lightness)

# this information then will need to be returned from 

