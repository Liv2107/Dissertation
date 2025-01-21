import pandas as pd
import numpy as np
import cv2

shades = pd.read_csv('datasets/FoundationShades/allCategories.csv')

# global photo

# photo = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV)