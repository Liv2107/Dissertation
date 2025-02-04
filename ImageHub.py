# start writing a database with sqlite 3

import sqlite3

connection = sqlite3.connect('ImageHub.db')
cursor = connection.cursor()

create_table = """CREATE TABLE IF NOT EXISTS Images(
    ID INTEGER(10) PRIMARY KEY,
    Image TEXT(255),
    UseableImage TEXT(255)
)"""

cursor.execute(create_table)