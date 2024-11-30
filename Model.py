import pandas as pd
import numpy as np
import cv2

shades = pd.read_csv('datasets/FoundationShades/allCategories.csv')
FSCD = pd.read_csv('datasets/SkinTones/FSCD_data.csv')
SSCC = pd.read_csv('datasets/SkinTones/SSCC_data.csv')
CCSG = pd.read_csv('datasets/SkinTones/CCSG_data.csv')

# global photo

# photo = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV)