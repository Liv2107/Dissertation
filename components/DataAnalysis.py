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

    # Missing Values
    missing_values = shades.isnull().sum()
    missing_values = missing_values[missing_values > 0]
    if not missing_values.empty:
        print("\nMissing Values:\n", missing_values)
        plt.figure(figsize=(8, 4))
        missing_values.plot(kind='bar', color='salmon')
        plt.title('Missing Values per Column')
        plt.show()

    print("Dataset Shape:", shades.shape)
    print("\nData Types:\n", shades.dtypes)



except:
    print("matplotlib no")