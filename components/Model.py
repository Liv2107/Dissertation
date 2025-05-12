# API's
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
from werkzeug.utils import secure_filename
import json
from waitress import serve


# Libraries
import pandas as pd
import numpy as np
import cv2
import os
import random

# Colour similarity - eg - Delta E or euclidean distance with rgb but delta is a lot more accurate. 
from colormath.color_diff import delta_e_cie2000
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color

# API
app = Flask(__name__)
CORS(app, origins=["exp://192.168.1.100:8081", "http://localhost:8081"])


# Prerequisites
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_colours(image, skin_mask, num=5):
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        skin_pixels = np.column_stack(np.where(skin_mask > 0)) # where there is skin.
        sampled_pixels = random.sample(list(skin_pixels), num) # random pixel locations.
        
        color_samples = []
        for y, x in sampled_pixels:
            color_samples.append(image[y, x]) # list of rgb values of 5 random pixels.

        avg_color = np.mean(color_samples, axis=0) # average of them 5 pixels.

        #print(f"Extracted Colors (RGB): {color_samples}")
        #print(f"Average Skin Color (RGB): {avg_color.astype(int)}")

        return avg_color.astype(int)

def verify_skin(image):
    try:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        lower_values = np.array([0, 40, 100], dtype=np.uint8)
        upper_values = np.array([20, 150, 230], dtype=np.uint8) # skin tone values. 

        skin_mask = cv2.inRange(hsv, lower_values, upper_values)

        kernel = np.ones((3, 3), np.uint8)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel) # noise reduction

        #cv2.imshow("Skin Mask", skin_mask)
        #cv2.waitKey(0)
        #cv2.destroyAllWindows()

        return skin_mask

    except:
        print("Error in verify_skin")
        return False


# Model
@app.route('/top_20', methods=['POST'])
def ImageProcessing():

    # Loading dataset.
    try:
        dataset_path = os.path.join(os.path.dirname(__file__), 'Datasets', 'allCategories.csv')
        shades = pd.read_csv(dataset_path)
    except FileNotFoundError:
        return jsonify({"error": "Dataset not found"}), 500


    try:
        photo_data = request.form.get("photo")

        if not photo_data:
            return jsonify({"error": "No photo data found"}), 400
        
        photo_data = photo_data.split(",")[1]
        photo_bytes = base64.b64decode(photo_data)
        photo_file = io.BytesIO(photo_bytes)

        image = Image.open(photo_file)

        image = image.convert("RGB")

        image = np.array(image)

        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        print("Image successfully opened:", image.shape)

        #image1 = cv2.imread('../assets/images/jacob.jpeg', cv2.IMREAD_COLOR)
        #image2 = cv2.imread('../assets/images/mason.jpeg', cv2.IMREAD_COLOR)
        #image3 = cv2.imread('../assets/images/person1.jpg', cv2.IMREAD_COLOR)
        #image4 = cv2.imread('../assets/images/person2.jpg', cv2.IMREAD_COLOR)

        skin_mask = verify_skin(image)
        #skin_mask1 = verify_skin(image1)
        #skin_mask2 = verify_skin(image2)
        #skin_mask3 = verify_skin(image4)

        if skin_mask is not None:
            print("Skin detected successfully.")
        else:
            return jsonify({"error": "No skin detected (maybe eyes, hair, or background)."}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500
    

    RGB = extract_colours(image, skin_mask, 50000)


    def get_lab(rgb):
        bgr = np.uint8([[rgb]])
        lab = cv2.cvtColor(bgr, cv2.COLOR_RGB2LAB)
        return lab[0][0] 

    Lab = get_lab(RGB)

    #print("Lab values: ", Lab)

    def get_hex(R,G,B):
        return "#{:02x}{:02x}{:02x}".format(R, G, B)
    
    R, G, B = RGB

    try:
        R, G, B = int(R), int(G), int(B)
        hex_colour = get_hex(R,G,B)
    except:
        print("An integer error occured.")

    def find_lightness(Lab):
        return Lab[0]

    lightness = find_lightness(Lab)



    # convert hex values to lab to find lightness for delta e calculation

    def hex2lab(hex):
        RGBValues = sRGBColor.new_from_rgb_hex(hex)
        return convert_color(RGBValues, LabColor)

    shades["lab"] = shades["hex"].apply(hex2lab) # new column of Lab values.

    if shades.empty or shades["lab"].isnull().all():
        return jsonify({"error": "No valid shades found or image color could not be processed"})

    Lab_Color = LabColor(*Lab) 


    def delta_e(value):
        if not isinstance(value, LabColor):
            return np.nan 
    
        try:
            diff = delta_e_cie2000(Lab_Color, value) 
        
            if isinstance(diff, (float, int)):
                return diff
            else:
                print(f"Unexpected result from delta_e_cie2000: {diff}") 
                return np.nan  # Return NaN if the result is not numeric
            
        except Exception as e:
            print(f"Error in delta_e calculation: {e}")
            return np.nan

    shades["delta_e"] = shades["lab"].apply(delta_e)
    shades_sorted = shades.sort_values(by="delta_e", ascending=True) # sort database according to data

    top_20 = shades_sorted.head(20) # top 20 closest shades
    #print("Top twenty closest matches: ", top_20)

    top_20_info = top_20[['brand', 'name', 'imgSrc', 'url', 'hex', 'product', 'delta_e']].to_dict(orient="records")
    #print(top_20_info)

    #print("Delta_e values: ", top_20['delta_e'])

    return jsonify(top_20_info)


if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=5000)