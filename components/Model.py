# API's
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
from werkzeug.utils import secure_filename
import json

# Libraries
import pandas as pd
import numpy as np
import cv2
import os

# Colour similarity - eg - Delta E or euclidean distance with rgb but delta is a lot more accurate. 
from colormath.color_diff import delta_e_cie2000
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color

# API
app = Flask(__name__)
CORS(app)

# Prerequisites
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# currently the model is being sent a base64 file object but we arnt trying to read that. make adjustments for base64

# Model
@app.route('/top_20', methods=['POST'])
def ImageProcessing():

    try:
        shades = pd.read_csv('Datasets/allCategories.csv')
    except FileNotFoundError:
        return jsonify({"error": "Dataset not found"}), 500

    if 'photo' not in request.form:
        return jsonify({"error": "No image provided"}), 400
    
    photo = request.form['photo']

    if photo.startswith('data:image/jpeg;base64,'):
        photo_data = photo_data[len('data:image/jpeg;base64,'):]

    try:
        photo_binary = base64.b64decode(photo_data)
    except Exception as e:
        return jsonify({"error": f"Failed to decode base64: {str(e)}"}), 400


    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        photo.save(filepath)
    else:
        return jsonify({"error": "Invalid file type or no file selected"}), 400

    try:
        image = Image.open(filepath)
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    except Exception as e:
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

    height, width, _ = image.shape

    # cropping and downscaling

    mid_width, mid_height = int(width / 2), int(height / 2)

    crop_size = 100
    if width >= 200 and height >= 200:
        croppedImage = image[mid_height - crop_size:mid_height + crop_size, mid_width - crop_size:mid_width + crop_size]
    else:
        croppedImage = image  # Skip cropping for small images

    target_height = 120
    scale = height/target_height

    if height > target_height:
        scale = height / target_height
        downscaledImage = cv2.resize(croppedImage, (int(width / scale), target_height), interpolation=cv2.INTER_AREA)
    else:
        downscaledImage = croppedImage  # Skip resizing for small images

    image = downscaledImage


    #cv2.imwrite("Images/cropped_downscaled_image.jpg", downscaledImage, (cv2.IMWRITE_JPEG_QUALITY, 95))
    #print(type(image))
    #print("Height: ", height, ", Width: ", width, ", Channels: ", channels)
    #Display the image
    #cv2.imshow('image', image)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()

    def RGB_values(image):
        RGBValues = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        return np.mean(RGBValues.reshape(-1, 3), axis=0)
    def Lab_values(image):
        LabValues = cv2.cvtColor(image, cv2.COLOR_BGR2Lab)
        return np.mean(LabValues.reshape(-1, 3), axis=0)

    RGB = RGB_values(image)
    Lab = Lab_values(image)

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

    # Calculating delta_e using lab values comparing the users image to the shades avaliable.

    h, w, _ = image.shape

    Lab_Color = LabColor(*Lab[h//2, w//2])  # Select centre pixel (L, a, b)


    def delta_e(value):

        if not isinstance(value, LabColor):
            print(f"Unexpected type: {type(value)}")
            return np.nan

        return delta_e_cie2000(Lab_Color, value)

    shades["delta_e"] = shades["lab"].apply(delta_e) # apply delta
    shades = shades.sort_values(by="delta_e", ascending=True) # sort database according to data

    top_20 = shades.head(20) # find top 20 closest shades
    print("Top ten closest matches: ", top_20)

    top_20_info = top_20[['brand', 'name', 'imgSrc', 'url']].to_dict(orient="records")
    print(top_20_info)

    return jsonify(top_20_info)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)



# print("hex, lightness of image: ", get_hex(R, G, B), find_lightness(avgLab))
    # name_brand_hex_lightness = top_20[['name', 'brand', 'hex', 'lightness']]
    # print(name_brand_hex_lightness)