import pandas as pd
import numpy as np
import cv2

shades = pd.read_csv('datasets/FoundationShades/allCategories.csv')

print(shades.to_string())