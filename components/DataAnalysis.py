import pandas as pd
import matplotlib.pyplot as plt



try:
    shades = pd.read_csv('Datasets/allCategories.csv')
except:
    print("pandas no")


try:        

    # Histogram of lightness distribution.

    shades_sorted = shades.sort_values(by='lightness')

    plt.figure(figsize=(10, 6))
    plt.hist(shades_sorted['lightness'], bins=50, color='white', edgecolor='black')

    plt.title("Diversity of Skin Tones: Lightness Distribution")
    plt.xlabel('Lightness')
    plt.ylabel('Frequency')
    plt.xticks([0, 0.25, 0.5, 0.75, 1], ['Dark', '', '', '', 'Light'])
    plt.tight_layout()

    #plt.show()


    # Bar graph to show how many different brands the app contains.

    unique_brands = shades['brand'].nunique() 
    print(unique_brands)

    brand_counts = shades['brand'].value_counts()

    plt.figure(figsize=(10, 6))
    brand_counts.plot(kind='bar', color='skyblue', edgecolor='black')

    plt.title("Number of Different Brands in Dataset")
    plt.xlabel('Brand')
    plt.ylabel('Frequency')
    plt.xticks(rotation=45, ha='right', fontsize=8)
    plt.tight_layout()

    #plt.show()



except:
    print("matplotlib no")